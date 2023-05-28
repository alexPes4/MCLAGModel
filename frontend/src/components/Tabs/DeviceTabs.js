import * as React from 'react';
import Box from '@mui/material/Box';
import {useEffect, useState} from "react";
import BreadCrumbsTop from "../Objects/BreadCrumbsTop";
import Button from "@mui/material/Button";
import {render} from "react-dom";
import {TabList} from "@mui/lab";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import {DataGrid} from "@mui/x-data-grid";
import TabContext from "@mui/lab/TabContext";
import Link from "@mui/material/Link";
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {Hidden, Input} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';

async function showPorts(deviceId) {
    let data=[];
    await fetch("http://localhost:8080/objects/portsForDevice?deviceId="+deviceId)
        .then(res=>res.json())
        .then((ports) => {
            data= setRows(ports);
        });
    return data;
}

async function deletePort(deviceId) {
    let rows = document.getElementsByClassName("MuiDataGrid-row Mui-selected");
    let portIdsForDelete = [];
    if (rows.length > 0) {
        console.log(rows);
        for (let i = 0; i < rows.length; i++) {
            portIdsForDelete.push(rows[i].querySelector('[data-field="id"]').firstChild.textContent);
        }
    }
    var params = "";
    for (var i = 0; i < portIdsForDelete.length; i++) {
        params += "&portIds=" + portIdsForDelete[i];
    }
    params += "&deviceId=" + deviceId;
    console.log(params);
    // await axios.get('http://localhost:8080/objects/deletePorts?' + params
    //     //,null,
    //     //{ params : {portIdsForDelete:params}}
    // ).then(function (response) {console.log(response)});
    // window.reload();
    await fetch('http://localhost:8080/objects/deletePorts?' + params).then(res=>res.text())
        .then((strings) => {
            window.location.href=strings;
        });
    // await ajax('http://localhost:8080/objects/deletePorts?' + params, "GET").then(
    //     (assignmentData) => {
    //         //setAssignment(assignmentData);
    //         console.log(assignmentData);
    //     }
    // );
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
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 230, renderCell: (params) => (
            <Link href={`/${params.row.id}`}>{params.value}</Link>
        ) },
    { field: 'description', headerName: 'Description', width: 330 }
];
export default function Object(props) {

    const [value, setValue] = React.useState("1");
    const [rows, setRow] = useState([]);
    const objectId=props.objectId;
    const handleChange =async (event, newValue) =>  {
        if (newValue==1) {
            let data = await showPorts(objectId);
            setRow(data);
        }
        setValue(newValue);
    };
    useEffect(  ()=>  {
        fetch("http://localhost:8080/objects/portsForDevice?deviceId="+objectId)
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
                        <Tab label="Ports" value="1"  />
                        <Tab label="Parameters" value="2" />
                    </TabList>
                </Box>

                <TabPanel value="1">
                    <div style={{ width: '100%' }}>
                        <Stack spacing={2} direction="row" style={{marginBottom: 10}}>
                            <FormDialog deviceId={objectId}></FormDialog>
                            <Button variant="outlined" startIcon={<DeleteIcon/>} onClick={ () =>  {
                                deletePort(objectId);
                            }}>Delete Ports</Button>
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
                    Parameters
                </TabPanel>
            </TabContext>
        </Box>
    );

}

function FormDialog(props) {

    const deviceId=props.deviceId;
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button variant="outlined" startIcon={<AddCircleIcon/>}  onClick={handleClickOpen}>
                Add Port
            </Button>
            <Dialog open={open} onClose={handleClose} component="form" action='http://localhost:8080/objects/createPort' method='POST'>
                <DialogTitle>Create Port</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Here you can create new port for the device
                    </DialogContentText>
                    <TextField name="name" autoFocus margin="dense" id="outlined-basic" label="Name" fullWidth variant="outlined" defaultValue="1GbE"/>
                    <TextField   name="description" margin="dense" id="outlined-basic" label="Description" fullWidth variant="outlined" defaultValue="Ethernet Port"/>
                    <Input  name="deviceId" type="hidden"  margin="dense"  value={deviceId}  id="outlined-basic" label="deviceId" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type = "submit">Create</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}