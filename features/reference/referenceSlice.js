import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  favorites: [],
  showFavorites: false,
}

export const referenceSlice = createSlice({
  name: 'reference',
  initialState,
  reducers: {
    addClick: (state, action) => {
      const { char } = action.payload
      state.favorites.push(char)
      if (state.favorites.length === 0) {
        state.showFavorites = false
      }
    },
    removeClick: (state, action) => {
      const { index } = action.payload
      console.log('removeClick', index)
      state.favorites.splice(index, 1)
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
  addClick,
  removeClick,
  showFavoritesSwitch,
  favoritesInputChange,
} = referenceSlice.actions

export default referenceSlice.reducer
