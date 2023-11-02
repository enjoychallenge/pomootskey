import * as React from 'react'
import AppBar from '../component/AppBar'
import Box from '@mui/material/Box'
import layout_styles from '../styles/common/layout.module.scss'
import input_styles from '../styles/common/input.module.scss'
import { InputBase, Paper } from '@mui/material'
import BackspaceButton from '../component/BackspaceButton'
import { useState } from 'react'

export default function PointerEventsPage() {
  const [messages, setMessages] = useState([])
  const msgDivs = messages
    .concat()
    .reverse()
    .map((msg, idx) => {
      return <div key={idx}>{msg}</div>
    })
  const log = (msg, e) => {
    if (e) {
      const targetEl = e.target
      const targetElId = targetEl && targetEl.id
      // const relatedTargetEl = e.relatedTarget
      // const relatedTargetElId = targetEl && relatedTargetEl.id
      const elFromPoint = document.elementFromPoint(e.clientX, e.clientY)
      const elFromPointId = elFromPoint && elFromPoint.id
      console.log(
        msg,
        'target',
        targetEl,
        // 'relatedTarget',
        // relatedTargetEl,
        'elFromPoint',
        elFromPoint,
        'event',
        e
      )
      setMessages((messages) =>
        messages.concat([
          // `${msg} targetElId=${targetElId} relatedTargetElId=${relatedTargetElId} elFromPoint=${elFromPointId}`,
          `${msg} targetElId=${targetElId} elFromPoint=${elFromPointId}`,
        ])
      )
    } else {
      console.log(msg)
      setMessages((messages) => messages.concat([msg]))
    }
  }
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
            <div
              id="parentEl"
              style={{ padding: '20px 40px', backgroundColor: '#ddd' }}
              onPointerEnter={(e) => {
                log('onPointerEnter (parent)', e)
              }}
              onPointerLeave={(e) => {
                log('onPointerLeave (parent)', e)
              }}
              onPointerOut={(e) => {
                log('onPointerOut (parent)', e)
              }}
              onPointerDown={(e) => {
                log('onPointerDown (parent)')
              }}
              onPointerMove={(e) => {
                // log('onPointerMove (parent)')
              }}
              onPointerUp={(e) => {
                log('onPointerUp (parent)')
              }}
              onPointerCancel={(e) => {
                log('onPointerCancel (parent)')
              }}
            >
              <div
                id="firstChildEl"
                style={{ padding: '20px 40px', backgroundColor: 'lightyellow' }}
                onPointerDown={(e) => {
                  log('onPointerDown (first child)')
                  // trigger pointer enter/leave if user is touching and moving out of this element
                  // https://stackoverflow.com/a/70737325/5259610
                  if (e.target.hasPointerCapture(e.pointerId)) {
                    log('onPointerDown (first child) releasePointerCapture')
                    e.target.releasePointerCapture(e.pointerId)
                  }
                }}
                onPointerEnter={(e) => {
                  log('onPointerEnter (first child)', e)
                }}
                onPointerLeave={(e) => {
                  log('onPointerLeave (first child)', e)
                }}
                onPointerOut={(e) => {
                  log('onPointerOut (first child)', e)
                }}
                onPointerMove={(e) => {
                  // log('onPointerMove (first child)')
                }}
                onPointerUp={(e) => {
                  log('onPointerUp (first child)')
                }}
                onPointerCancel={(e) => {
                  log('onPointerCancel (first child)')
                }}
              >
                <div
                  id="firstChildInnerEl"
                  style={{
                    padding: 20,
                    backgroundColor: 'yellow',
                    pointerEvents: 'none',
                  }}
                >
                  First child
                </div>
              </div>
              <div
                id="secondChildEl"
                style={{ padding: '20px 40px', backgroundColor: 'lightblue' }}
                onPointerDown={(e) => {
                  log('onPointerDown (second child)')
                  // trigger pointer enter/leave if user is touching and moving out of this element
                  // https://stackoverflow.com/a/70737325/5259610
                  if (e.target.hasPointerCapture(e.pointerId)) {
                    log('onPointerDown (second child) releasePointerCapture')
                    e.target.releasePointerCapture(e.pointerId)
                  }
                }}
                onPointerEnter={(e) => {
                  log('onPointerEnter (second child)', e)
                }}
                onPointerLeave={(e) => {
                  log('onPointerLeave (second child)', e)
                }}
                onPointerOut={(e) => {
                  log('onPointerOut (second child)', e)
                }}
                onPointerMove={(e) => {
                  // log('onPointerMove (second child)')
                }}
                onPointerUp={(e) => {
                  log('onPointerUp (second child)')
                }}
                onPointerCancel={(e) => {
                  log('onPointerCancel (second child)')
                }}
              >
                <div
                  id="secondChildInnerEl"
                  style={{
                    padding: 20,
                    backgroundColor: 'blue',
                    pointerEvents: 'none',
                  }}
                >
                  Second child
                </div>
              </div>
            </div>
          </Box>
          <Box
            sx={{ color: 'result.main' }}
            className={layout_styles.results_box}
          >
            <Box
              className={layout_styles.result_cases}
              style={{ fontSize: '50%' }}
            >
              {msgDivs}
            </Box>
            <Paper className={input_styles.input_paper}>
              <InputBase
                multiline
                fullWidth
                value={''}
                readOnly={true}
                variant="filled"
                size="small"
                className={input_styles.text_input}
              />
              <BackspaceButton onClick={null} onLongPress={null} />
            </Paper>
          </Box>
        </Box>
      </Box>
    </>
  )
}
