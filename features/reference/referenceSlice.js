import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  favorites: [],
  showFavorites: false,
}

export const referenceSlice = createSlice({
  name: 'reference',
  initialState,
  reducers: {
    favoriteStarClick: (state, action) => {
      const { char } = action.payload
      const clickedCharIndex = state.favorites.indexOf(char)
      if (clickedCharIndex === -1) {
        state.favorites.push(char)
      } else {
        state.favorites = state.favorites.filter((c) => c !== char)
      }
      if (state.favorites.length === 0) {
        state.showFavorites = false
      }
    },
    favoritesInputChange: (state, action) => {
      const input = action.payload
      state.favorites = input.split('')
      state.showFavorites = state.favorites.length > 0
    },
    showFavoritesSwitch: (state) => {
      state.showFavorites = !state.showFavorites
    },
  },
})

export const {
  favoriteStarClick,
  showFavoritesSwitch,
  favoritesInputChange,
  favoritesInputBlur,
} = referenceSlice.actions

export default referenceSlice.reducer
