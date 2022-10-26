import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import HelpIcon from '@mui/icons-material/Help';
import AboutDialog from "../component/AboutDialog";

export default function ButtonAppBar() {
  const [aboutOpen, setAboutOpen] = React.useState(false);

  const handleAboutClick = () => {
    setAboutOpen(true);
  };

  const handleAboutClose = () => {
    setAboutOpen(false);
  };

  return (
      <>
        <Box sx={{flexGrow: 1}}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{flexGrow: 1}} component="a" href="/">
                Enjoy Pomootskey
              </Typography>
              <IconButton
                  size="large"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleAboutClick}
              >
                <HelpIcon/>
              </IconButton>
            </Toolbar>
          </AppBar>
        </Box>
        <AboutDialog open={aboutOpen} handleClose={handleAboutClose} />
      </>
  );
}
