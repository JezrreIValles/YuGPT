import React, { useState } from "react";
import { Typography, Button, Box, Drawer, List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"; // Asegúrate de importar los componentes de Material-UI
import { MenuOutlined, AssuredWorkloadOutlined, DashboardOutlined, LoginOutlined, LogoutOutlined } from "@mui/icons-material";

function Navbar() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{width: 250}} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {['Conciliaciones', 'Dashboard'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <AssuredWorkloadOutlined/> : <DashboardOutlined/>}
              </ListItemIcon>
              <ListItemText primary={text}/>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['Iniciar sesión', 'Cerrar sesión'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <LogoutOutlined/> : <LoginOutlined/>}
              </ListItemIcon>
              <ListItemText primary={text}/>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div className="w-full h-16 bg-white flex justify-between items-center p-4 border-b border-[#EEEEEE]">
      <div className="flex items-center gap-4">
        <MenuOutlined fontSize="large" onClick={toggleDrawer(true)} />
        <Drawer open={open} onClose={toggleDrawer(false)}>
          {DrawerList}
        </Drawer>
        <div className="grid grid-cols-2 items-center">
        <Typography fontSize="42px">
          YuGPT
        </Typography>
        <Typography fontSize="32px">
          Conciliación Bancaria
        </Typography>
        </div>
      </div>
      <Button variant="contained">
        <Typography fontSize="16px">
        Iniciar sesión
        </Typography>
        </Button>
    </div>
  );
}

export default Navbar;
