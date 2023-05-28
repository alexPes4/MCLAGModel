import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import {Input, Typography} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import {DataGrid} from "@mui/x-data-grid";
import Link from "@mui/material/Link";
import {useEffect, useState} from "react";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

async function deleteDevices(parentLocId) {
    let rows = document.getElementsByClassName("MuiDataGrid-row Mui-selected");
    let devIdsForDelete = [];
    if (rows.length > 0) {
        console.log(rows);
        for (let i = 0; i < rows.length; i++) {
            devIdsForDelete.push(rows[i].querySelector('[data-field="id"]').firstChild.textContent);
        }
    }
    var params = "";
    for (var i = 0; i < devIdsForDelete.length; i++) {
        params += "&devIds=" + devIdsForDelete[i];
    }
    params += "&parentId=" + parentLocId;
    await fetch('http://localhost:8080/objects/devices/deleteDevices?' + params).then(res=>res.text())
        .then((strings) => {
            window.location.href=strings;
        });
}


function setRows(result,typeId) {
    let data=[]
    for(let i=0;i<result.length;i++){
        console.log(result[i].objectId+"|"+result[i].name+"|"+result[i].description);
        if (result[i].typeId==typeId)
        data.push({ id: result[i].objectId, name: result[i].name, description: result[i].description})
    }
    return data;
}
const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 500, renderCell: (params) => (
            <Link href={`/${params.row.id}`}>{params.value}</Link>
        ) },
    { field: 'description', headerName: 'Description', width: 330 }
];

export default function  DevicesTableForObject(props) {

    const object=props.object;
    const [open, setOpen] = React.useState(false);
    const [devices, setDevices] = useState([]);
    const [cards, setCards] = useState([]);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    useEffect(  ()=>  {
            fetch("http://localhost:8080/objects/devices/getDeviceForParent?parentId="+object.objectId)
                .then(res=>res.json())
                .then((result) => {
                    setDevices(setRows(result,12));
                    setCards(setRows(result,11));
                });
        }, []
    );

    return (
        <div style={{width: '100%' }}>
            <Stack spacing={2} direction="row" style={{marginBottom: 10}}>
                <FormCreateDevice objectId={object.objectId}></FormCreateDevice>
                <Button variant="outlined" startIcon={<DeleteIcon/>} onClick={ () =>  {
                    deleteDevices(object.objectId);
                }}>Delete Device</Button>
            </Stack>
            <Typography variant="button" display="block" gutterBottom style={{marginTop:15, marginBottom:5}} >
                Devices
            </Typography>
            <DataGrid
                rows={devices}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection

            />
            <Typography variant="button" display="block" gutterBottom style={{marginTop:15, marginBottom:5}} >
                Cards
            </Typography>
            <DataGrid
                rows={cards}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection

            />
        </div>
    );
}

function FormCreateDevice(props) {

    const locationId=props.objectId;
    const [open, setOpen] = React.useState(false);
    const [typeDev, setTypeDev] = React.useState();
    const handleClickOpen = (typeDev) => {
        setOpen(true);
        console.log("typeDev:"+typeDev);
        setTypeDev(typeDev);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            {/*<Button variant="outlined" startIcon={<AddCircleIcon/>}  onClick={handleClickOpen}>*/}
            {/*    Add Device*/}
            {/*</Button>*/}
            <AddPoints variant="contained" onClick={handleClickOpen}/>
            <Dialog open={open} onClose={handleClose} component="form" action={`http://localhost:8080/objects/devices/${(typeDev==11)?"createNewCard":"createNewDevice"}`} method='POST'>
                <DialogTitle>Create {typeDev==11?"Card":"Device"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Here you can create new {typeDev==11?"Card":"Device"} in the location
                    </DialogContentText>
                    <TextField name="name" autoFocus margin="dense" id="outlined-basic" label="Name" fullWidth variant="outlined"/>
                    <TextField   name="description" margin="dense" id="outlined-basic" label="Description" fullWidth variant="outlined"/>
                    <Input  name="parentId" type="hidden"  margin="dense"  value={locationId}  id="outlined-basic" label="parentId" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type = "submit">Create</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}


function AddPoints(props){
    const [anchorEl, setAnchorEl] = React.useState(null);
    const onClickDev = ()=>{
        props.onClick(12);
    }
    const onClickCard = ()=>{
        props.onClick(11);
    }
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <div>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                variant="outlined"
            >
                Add Device
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={onClickDev}>Add Device</MenuItem>
                <MenuItem onClick={onClickCard}>Add Card</MenuItem>
            </Menu>
        </div>
    )
}