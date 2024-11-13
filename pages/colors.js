import Box from '@mui/material/Box'
import layout_styles from '../styles/common/layout.module.scss'
import AppBar from '../component/AppBar'
import colors_styles from '../styles/colors.module.scss'
import * as React from 'react'
import { Button } from '@mui/material'
import Typography from '@mui/material/Typography'
import { colorButtonClick } from '../features/colors/colorsSlice'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import * as slctr from '../features/colors/colorsSelector'

const colors = {
  red: {
    label: 'Červená',
    color: '#ff0000',
  },
  orange: {
    label: 'Oranžová',
    color: '#ff7f00',
  },
  yellow: {
    label: 'Žlutá',
    color: '#ffff00',
  },
  green: {
    label: 'Zelená',
    color: '#00ff00',
  },
  cyan: {
    label: 'Cyan',
    color: '#00ffff',
  },
  blue: {
    label: 'Modrá',
    color: '#0000ff',
  },
  indigo: {
    label: 'Indigo',
    color: '#4b0082',
  },
  violet: {
    label: 'Fialová',
    color: '#9400d3',
  },
  magenta: {
    label: 'Magenta',
    color: '#ff00ff',
  },
  black: {
    label: 'Černá',
    color: '#000000',
  },
  white: {
    label: 'Bílá',
    color: '#ffffff',
  },
}

const colorGroups = {
  olympicCircles: {
    label: 'Olympijské kruhy',
    colors: [
      colors.blue,
      colors.yellow,
      colors.black,
      colors.green,
      colors.red,
    ],
  },
  rgb: {
    label: 'RGB',
    colors: [
      colors.red,
      colors.yellow,
      colors.green,
      colors.cyan,
      colors.blue,
      colors.magenta,
      colors.white,
    ],
  },
  cmyk: {
    label: 'CMYK',
    colors: [
      colors.cyan,
      colors.yellow,
      colors.magenta,
      colors.green,
      colors.red,
      colors.blue,
      colors.black,
    ],
  },
  maritimeFlags: {
    label: 'Vlajková abeceda',
    colors: [
      colors.white,
      colors.blue,
      colors.red,
      colors.yellow,
      colors.black,
    ],
  },
  rainbow: {
    label: 'Duha',
    colors: [
      colors.violet,
      colors.indigo,
      colors.blue,
      colors.green,
      colors.yellow,
      colors.orange,
      colors.red,
    ],
  },
  basicColors: {
    label: 'Základní barvy',
    colors: [
      colors.blue,
      colors.yellow,
      colors.red,
      colors.green,
      colors.orange,
      colors.violet,
      colors.black,
    ],
  },
  palapeli: {
    label: 'Palapeli logo',
    colors: [colors.red, colors.blue, colors.green, colors.yellow],
  },
}

const getColorsJsx = (colors, selected, dispatch) => {
  const colorsJsx = Object.entries(colors).map(([key, colorDef]) => {
    const className = selected.includes(key)
      ? colors_styles.selected
      : colors_styles.unselected
    return (
      <Button
        key={key}
        variant="outlined"
        onClick={() => {
          dispatch(colorButtonClick({ color: key }))
        }}
      >
        <svg width="100%" viewBox="0 0 10 10">
          <circle
            cx="5"
            cy="5"
            r="4"
            fill={colorDef.color}
            className={className}
          />
        </svg>
        <Typography>{colorDef.label}</Typography>
      </Button>
    )
  })
  return colorsJsx
}

const colorGroupColorsJsx = (groupColors, selectedColors) => {
  const colorGroupColorsJsx = groupColors.map((groupColor, index) => {
    const className = selectedColors.includes(groupColor)
      ? colors_styles.unselected
      : colors_styles.selected
    return (
      <Box key={index} className={colors_styles.groupColors}>
        <svg height="80%" viewBox="0 0 10 10">
          <circle
            cx="5"
            cy="5"
            r="4"
            fill={groupColor.color}
            className={className}
          />
        </svg>
      </Box>
    )
  })
  return colorGroupColorsJsx
}

const colorGroupsJsx = (colorGroups, selectedColors) => {
  const colorGroupsJsx = Object.entries(colorGroups)
    .filter(([_, groupDef]) => {
      return selectedColors.every((element) =>
        groupDef.colors.includes(element)
      )
    })
    .map(([key, groupDef]) => {
      return (
        <Box key={key}>
          <Typography>{groupDef.label}</Typography>
          <Box>{colorGroupColorsJsx(groupDef.colors, selectedColors)}</Box>
        </Box>
      )
    })
  return colorGroupsJsx
}

export default function ColorsPage() {
  const dispatch = useAppDispatch()
  const selected = useAppSelector(slctr.getSelected)

  const selectedColors = Object.entries(colors)
    .filter(([key, _]) => {
      return selected.includes(key)
    })
    .map(([_, colorDef]) => {
      return colorDef
    })

  return (
    <>
      <Box className={layout_styles.page}>
        <AppBar />
        <Box
          component="main"
          className={layout_styles.main_decoder}
          sx={{ color: 'primary.main' }}
        >
          <Box className={layout_styles.inputs_box}>
            <Box className={colors_styles.buttons}>
              {getColorsJsx(colors, selected, dispatch)}
            </Box>
          </Box>
          <Box className={colors_styles.groups} sx={{ color: 'result.main' }}>
            {colorGroupsJsx(colorGroups, selectedColors)}
          </Box>
        </Box>
      </Box>
    </>
  )
}
