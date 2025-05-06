import csv
import os
import json
from functools import reduce
from unidecode import unidecode

DIR_PATH = os.path.dirname(os.path.abspath(__file__))
root_directory = os.path.dirname(DIR_PATH)
app_decode_directory = os.path.join(root_directory, "app/decode")


def score_word(word: str, ngram_scores: dict) -> int:
    ngram_lengths = set(ngram_scores["cs"].keys()).union(
        set(ngram_scores["solutions"].keys())
    )
    ngram_lengths = {len for len in ngram_lengths}
    score_by_ngrams = {ngram_length: 0.0 for ngram_length in ngram_lengths}
    ngram_counts = {ngram_length: 0 for ngram_length in ngram_lengths}
    normalized_word = unidecode(word.lower())
    for idx in range(0, len(normalized_word) - 1):
        for ngram_length in ngram_lengths:
            if idx + ngram_length <= len(word):
                ngram = normalized_word[idx : (idx + ngram_length)]
                ngram_counts[ngram_length] += 1
                score = ngram_scores["cs"].get(ngram_length, {}).get(ngram, 0.0) + (
                    2 * ngram_scores["solutions"][ngram_length].get(ngram, 0.0)
                )
                score_by_ngrams[ngram_length] += score

    score = reduce(
        lambda accum, ngram_len_score: accum
        + (
            ngram_len_score[0] ** 2
            * (ngram_len_score[1] / max(ngram_counts[ngram_len_score[0]], 1))
        ),
        list(score_by_ngrams.items()),
        0,
    )
    return score


def sort_words(words: list) -> list:
    scores_filepath = os.path.join(app_decode_directory, "ngram_scores.json")
    with open(scores_filepath) as score_file:
        ngram_scores = json.load(score_file)
    ngram_scores = {
        key: {int(ngram_len): scores for ngram_len, scores in ngrams_scores.items()}
        for key, ngrams_scores in ngram_scores.items()
    }
    words_scores = [(word, score_word(word, ngram_scores)) for word in words if word]
    sorted_words_with_score = sorted(words_scores, key=lambda x: x[1], reverse=True)
    sorted_words = [word[0] for word in sorted_words_with_score]
    return sorted_words


def transform_csv_to_txt() -> None:
    csv_filepath = os.path.join(DIR_PATH, "substantives-sg-case-1.csv")
    words_filepath = os.path.join(app_decode_directory, "words.json")

    with open(csv_filepath, newline="") as csvfile:
        spamreader = csv.reader(csvfile, delimiter=";", quotechar='"')
        words = [row[1] for row in spamreader]

    ordered_words = sort_words(words)

    with open(words_filepath, "w") as words_file:
        json.dump(ordered_words, words_file, indent=0)


if __name__ == "__main__":
    transform_csv_to_txt()
