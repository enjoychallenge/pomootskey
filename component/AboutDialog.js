import * as React from 'react'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'

export default function AboutDialog({ open, handleClose }) {
  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle variant="h5">Enjoy Pomootskey</DialogTitle>
      <DialogContent>
        <Typography paragraph={true}>
          Aplikace <strong>Enjoy Pomootskey</strong> usnadňuje luštění během{' '}
          <Link target="_blank" rel="noreferrer" href="https://sifrovacky.cz/">
            šifrovacích her
          </Link>
          . Velkou inspirací nám jsou Androidí{' '}
          <Link
            target="_blank"
            rel="noreferrer"
            href="https://play.google.com/store/apps/details?id=cz.absolutno.sifry"
          >
            Šifrovací pomůcky Absolutno
          </Link>{' '}
          od Vaška Potočka, na které navazujeme.
        </Typography>
        <Typography variant="h6" gutterBottom>
          Autoři
        </Typography>
        <Typography paragraph={true}>
          Index a Jiřík,{' '}
          <Link target="_blank" href="https://enjoychallenge.tech/cs/">
            enjoychallenge.tech
          </Link>
        </Typography>
      </DialogContent>
    </Dialog>
  )
}
