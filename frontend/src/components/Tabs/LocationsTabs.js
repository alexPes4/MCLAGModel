import * as React from 'react';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import {TabList} from "@mui/lab";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import {DataGrid} from "@mui/x-data-grid";
import TabContext from "@mui/lab/TabContext";
import Link from "@mui/material/Link";
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import DevicesTableForObject from "./DevicesTableForObject";

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {FormControl, Input, InputLabel, MenuItem, Select} from "@mui/material";

async function showPorts(deviceId) {
    let data=[];
    await fetch("http://localhost:8080/objects/portsForDevice?deviceId="+deviceId)
        .then(res=>res.json())
        .then((ports) => {
            data= setRows(ports);
        });
    return data;
}
async function showLocations(object) {
    let data=[];
    await fetch("http://localhost:8080/objects/childLocations?locId="+object.objectId+"&typeId="+((object.typeId==13)?14:(object.typeId==14)?15:15))
        .then(res=>res.json())
        .then((locs) => {
            data= setRows(locs);
        });
    return data;
}

async function showNetworkElements(object) {
    let data=[];
    await fetch("http://localhost:8080/objects/NE/allForLocation?locId="+object.objectId)
        .then(res=>res.json())
        .then((neS) => {
            data= setRows(neS);
        });
    return data;
}

async function deleteLocations(parentLocId) {
    let rows = document.getElementsByClassName("MuiDataGrid-row Mui-selected");
    let locIdsForDelete = [];
    if (rows.length > 0) {
        console.log(rows);
        for (let i = 0; i < rows.length; i++) {
            locIdsForDelete.push(rows[i].querySelector('[data-field="id"]').firstChild.textContent);
        }
    }
    var params = "";
    for (var i = 0; i < locIdsForDelete.length; i++) {
        params += "&locIds=" + locIdsForDelete[i];
    }
    params += "&parentId=" + parentLocId;
    await fetch('http://localhost:8080/objects/deleteLocations?' + params).then(res=>res.text())
        .then((strings) => {
            window.location.href=strings;
        });
}
async function deleteNEs(parentLocId) {
    let rows = document.getElementsByClassName("MuiDataGrid-row Mui-selected");
    let nesIdsForDelete = [];
    if (rows.length > 0) {
        console.log(rows);
        for (let i = 0; i < rows.length; i++) {
            nesIdsForDelete.push(rows[i].querySelector('[data-field="id"]').firstChild.textContent);
        }
    }
    var params = "";
    for (var i = 0; i < nesIdsForDelete.length; i++) {
        params += "&neIds=" + nesIdsForDelete[i];
    }
    params += "&parentId=" + parentLocId;
    await fetch('http://localhost:8080/objects/NE/deleteNEs?' + params).then(res=>res.text())
        .then((strings) => {
            window.location.href=strings;
        });
}
function setRows(result) {
    let data=[]
    for(let i=0;i<result.length;i++){
        console.log(result[i].objectId+"|"+result[i].name+"|"+result[i].description);
        data.push({ id: result[i].objectId, name: result[i].name, description: result[i].description})
    }
    return data;
}
const columns = [
    { field: 'id', headerName: 'ID', width: 20 },
    { field: 'name', headerName: 'Name',  width: 230 , renderCell: (params) => (
            <Link href={`/${params.row.id}`}>{params.value}</Link>
        ) },
    { field: 'description', headerName: 'Description',  width: 330  }
];
export default function LocationTab(props) {

    const [rows, setRow] = useState([]);
    const object=props.object;
    const [value, setValue] = React.useState(object.typeId==15?"2":"1");
    const handleChange =async (event, newValue) =>  {
        if (newValue==1) {
            let data = await showLocations(object);
            setRow(data);
        }
        else if (newValue==2) {
            let data = await showNetworkElements(object);
            setRow(data);
        }
        setValue(newValue);
    };

    useEffect(  ()=>  {
            fetch((object.typeId==15?("http://localhost:8080/objects/NE/allForLocation?locId="+object.objectId)
                :("http://localhost:8080/objects/childLocations?locId="+object.objectId+"&typeId="+((object.typeId==13)?14:(object.typeId==14)?15:15)))
                )
                .then(res=>res.json())
                .then((ports) => {
                    setRow(setRows(ports));
                });
        }, []
    );
    return (
        <Box sx={{width: '100%', typography: 'body1'}} style={{textAlign: "left"}}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider'}}  >
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        {(object.typeId==13)?(
                            <Tab label="Cities" value="1"  />
                        ):(object.typeId==14)?(
                            <Tab label="Locations" value="1"  />
                        ):(object.typeId==15)?(
                            ''
                        ):(<></>)}
                        {(object.typeId==15)?(
                            <Tab label="Network Elements" value="2"  />
                            ):('')}
                        {(object.typeId==15)?(
                            <Tab label="Devices" value="3"  />
                        ):('')}
                        <Tab label="Parameters" value="4" />
                    </TabList>
                </Box>

                <TabPanel value="1">
                    <div style={{width: '100%' }}>
                        <Stack spacing={2} direction="row" style={{marginBottom: 10}}>
                            <FormDialog object={object}></FormDialog>
                            <Button variant="outlined" startIcon={<DeleteIcon/>} onClick={ () =>  {
                                deleteLocations(object.objectId);
                            }}>Delete Location</Button>
                        </Stack>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            checkboxSelection

                        />
                    </div>
                </TabPanel>
                <TabPanel value="2">
                    <div style={{width: '100%' }}>
                        <Stack spacing={2} direction="row" style={{marginBottom: 10}}>
                            <FormCreateNE object={object}></FormCreateNE>
                            <Button variant="outlined" startIcon={<DeleteIcon/>} onClick={ () =>  {
                                deleteNEs(object.objectId);
                            }}>Delete Network Element</Button>
                        </Stack>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            checkboxSelection

                        />
                    </div>
                </TabPanel>
                <TabPanel value="3">
                    <DevicesTableForObject object={object}/>
                </TabPanel>
                <TabPanel value="4">
                    Parameters
                </TabPanel>
            </TabContext>
        </Box>
    );

}

function FormDialog(props) {

    const object=props.object;
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button variant="outlined" startIcon={<AddCircleIcon/>}
                    onClick={handleClickOpen}>
                {(object.typeId==13)?(
                    'Add city'
                ):(object.typeId==14)?('Add Location'):('Add Location')}
            </Button>
            <Dialog open={open} onClose={handleClose} component="form"
                    action={(object.typeId==13)?(
                        'http://localhost:8080/objects/createCity'
                    ):(object.typeId==14)?('http://localhost:8080/objects/createLocation'):('http://localhost:8080/objects/createLocation')}method='POST'>
                <DialogTitle>Create Port</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Here you can create new port for the device
                    </DialogContentText>
                    <TextField name="name" autoFocus margin="dense" id="outlined-basic" label="Name" fullWidth variant="outlined"/>
                    <TextField   name="description" margin="dense" id="outlined-basic" label="Description" fullWidth variant="outlined"/>
                    <Input  name="parentId" type="hidden"  margin="dense"  value={object.objectId}  id="outlined-basic" label="deviceId" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type = "submit">Create</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

function FormCreateNE(props) {

    const object=props.object;
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const [type, setType] = React.useState('');

    const handleChange = (event) => {
        setType(event.target.value);
    };
    return (
        <div>
            <Button variant="outlined" startIcon={<AddCircleIcon/>}  onClick={handleClickOpen}>
                Create Network Element
            </Button>
            <Dialog open={open} onClose={handleClose} component="form"
                    action='http://localhost:8080/objects/NE/createNewNE' method='POST'>
                <DialogTitle>Create Network Element</DialogTitle>
                <DialogContent fullWidth>
                    <DialogContentText>
                        Here you can create new Network Element for the location
                    </DialogContentText>
                    <TextField name="name" autoFocus margin="dense" id="outlined-basic" label="Name" fullWidth variant="outlined"/>
                    <TextField   name="description" margin="dense" id="outlined-basic" label="Description" fullWidth variant="outlined" defaultValue="Network Element Description"/>
                    <FormControl   fullWidth required><InputLabel  id="demo-simple-select-label" >Type</InputLabel>

                   <Select name="typeId"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={type}
                        label="Type"
                        onChange={handleChange}
                    >
                        <MenuItem value={22} >Device NE</MenuItem>
                        <MenuItem value={9}>VM Server</MenuItem>
                    </Select>
                </FormControl>
                    <Input  name="parentId" type="hidden"  margin="dense"  value={object.objectId}  id="outlined-basic" label="deviceId" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type = "submit">Create</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}