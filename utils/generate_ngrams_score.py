import os
import json
import unidecode
import string

DIR_PATH = os.path.dirname(os.path.abspath(__file__))


def normalize_solution(text: str) -> str:
    translator = str.maketrans('', '', string.punctuation + string.digits + string.whitespace)
    return unidecode.unidecode(text.lower()).translate(translator)


def calculate_ngram_scores(ngram_counts: dict) -> dict:
    precalculated_values = {
        'sum': 0,
        'max': 0,
        'min': None,
        'counts': {},
    }
    for n_gram, count in ngram_counts.items():
        precalculated_values['counts'][normalize_solution(n_gram)] = precalculated_values['counts'].get(
            normalize_solution(n_gram), 0) + count

    for n_gram, count in precalculated_values['counts'].items():
        precalculated_values['sum'] += count
        precalculated_values['max'] = max(precalculated_values['max'], count)
        precalculated_values['min'] = min(precalculated_values['min'], count) if precalculated_values['min'] else count

    return {
        n_gram: round(max(
            1 - ((precalculated_values['max'] - count) / max(precalculated_values['max'] - precalculated_values['min'], 1)),
            0.05), 2)
        for n_gram, count in precalculated_values['counts'].items()
    }


def calculate_cs_ngram_scores(ngrams_cs_filepath: str) -> dict:
    with open(ngrams_cs_filepath) as f:
        ngrams_cs = json.load(f)
    return {
        1: calculate_ngram_scores(ngrams_cs['monograms']),
        2: calculate_ngram_scores(ngrams_cs['bigrams']),
        3: calculate_ngram_scores(ngrams_cs['trigrams']),
    }


def save_ngram_scores(scores: dict) -> None:
    root_directory = os.path.dirname(DIR_PATH)
    app_decode_directory = os.path.join(root_directory, 'app/decode')
    scores_filepath = os.path.join(app_decode_directory, 'ngram_scores.json')
    with open(scores_filepath, 'w') as file:
        json.dump(scores, file, indent=2, sort_keys=True)


def calculate_solutions_ngram_scores(solutions_filepath: str) -> dict:
    ngram_lengths = [1, 2, 3]
    ngram_counts = {length: {} for length in ngram_lengths}
    with open(solutions_filepath) as file:
        for raw_line in file:
            if not raw_line.strip().startswith('#'):
                line = normalize_solution(raw_line)
                for idx, char in enumerate(line):
                    ngram_counts[1][char] = ngram_counts[1].get(char, 0) + 1
                    if idx < len(line) - 1:
                        bigram = line[idx:idx + 2]
                        ngram_counts[2][bigram] = ngram_counts[2].get(bigram, 0) + 1
                        if idx < len(line) - 2:
                            trigram = line[idx:idx + 3]
                            ngram_counts[3][trigram] = ngram_counts[3].get(trigram, 0) + 1
    return {
        1: calculate_ngram_scores(ngram_counts[1]),
        2: calculate_ngram_scores(ngram_counts[2]),
        3: calculate_ngram_scores(ngram_counts[3]),
    }


if __name__ == '__main__':
    ngrams_cs_filepath = os.path.join(DIR_PATH, 'ngram_counts_cs.json')
    solutions_filepath = os.path.join(DIR_PATH, 'solutions_from_games.txt')
    result = {
        'cs': calculate_cs_ngram_scores(ngrams_cs_filepath=ngrams_cs_filepath),
        'solutions': calculate_solutions_ngram_scores(solutions_filepath=solutions_filepath),
    }
    save_ngram_scores(result)
