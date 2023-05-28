import * as React from "react";
import {useTheme} from "@mui/material/styles";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import {Input, InputLabel, MenuItem, OutlinedInput, Select, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import DialogActions from "@mui/material/DialogActions";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import {DataGrid} from "@mui/x-data-grid";
import Link from "@mui/material/Link";
import {useEffect, useState} from "react";
import AddCircleIcon from '@mui/icons-material/AddCircle';

async function releaseDevicesFromNe(neId) {
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
        params += "&devIds=" + portIdsForDelete[i];
    }
    params += "&neId=" + neId;
    console.log(params);
    await fetch('http://localhost:8080/objects/NE/releaseDevicesFromNe?' + params).then(res=>res.text())
        .then((strings) => {
            window.location.href=strings;
        });
}
async function showDevices(neId){
    let data=[];
    await fetch("http://localhost:8080/objects/NE/getAssignDeviceOnNE?neId="+neId)
        .then(res=>res.json())
        .then((devices) => {
            data= setRows(devices);
        });
    return data;
}
function setRows(result,typeId) {
    let data=[]
    for(let i=0;i<result.length;i++){
        console.log(result[i].objectId+"|"+result[i].name+"|"+result[i].description);
        if (result[i].typeId==typeId||typeId==null)
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

export default function DevicesTableForNEDevices(props){
    const objectNE=props.object;
    const neId=objectNE.objectId;
    const [devices, setDevices] = useState([]);
    const [cards, setCards] = useState([]);

    useEffect(  ()=>  {
            fetch("http://localhost:8080/objects/NE/getAssignDeviceOnNE?neId="+neId)
                .then(res=>res.json())
                .then((devices) => {
                    setDevices(setRows(devices,12));
                    setCards(setRows(devices,11));
                });
        }, []
    );
    return (
        <div style={{  width: '100%' }}>
            <Stack spacing={2} direction="row" style={{marginBottom: 10}}>
                <AddDevice locId={objectNE.parentId} neId={neId}></AddDevice>
                <Button variant="outlined" startIcon={<DeleteIcon/>} onClick={ () =>  {
                    releaseDevicesFromNe(neId);
                }}>Release Device</Button>
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
            <Stack spacing={2} direction="row" style={{marginBottom: 10}}>
                <AddDevice locId={objectNE.parentId} neId={neId}></AddDevice>
                <Button variant="outlined" startIcon={<DeleteIcon/>} onClick={ () =>  {
                    releaseDevicesFromNe(neId);
                }}>Release Cards</Button>
            </Stack>
            <DataGrid
                rows={cards}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
            />

        </div>
    )


}



const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

let names = [
    // 'Oliver Hansen',
    // 'Van Henry',
    // 'April Tucker',
    // 'Ralph Hubbard',
    // 'Omar Alexander',
    // 'Carlos Abbott',
    // 'Miriam Wagner',
    // 'Bradley Wilkerson',
    // 'Virginia Andrews',
    // 'Kelly Snyder',
    // { field: 'id'},
    // { field: 'name' },
    // { field: 'description' }
];

async function getDevicesToAssign(locId){
    let data=[];
    await fetch("http://localhost:8080/objects/NE/getDevicesToAssign?locId="+locId)
        .then(res=>res.json())
        .then((locs) => {
            data= setRows(locs,null);
            console.log("data:"+data);
        });

    return data;
}
function  AddDevice(props) {

    const locId=props.locId;
    const neId=props.neId;
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = async () => {
        let data = await getDevicesToAssign(locId);
        console.log(data)
        names = data;
        setOpen(true);

    };

    const handleClose = () => {
        setOpen(false);
    };

    const getNameFromNames = (id) => {
        for(let i=0;i<names.length;i++){
            if(names[i].id==id) return names[i].name;
        }
    };

    const theme = useTheme();
    const [personName, setPersonName] = React.useState([]);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };


    return (
        <div>
            <Button variant="outlined" startIcon={<AddCircleIcon/>}  onClick={handleClickOpen}>
                Assign Devices
            </Button>
            <Dialog open={open} onClose={handleClose} component="form" action='http://localhost:8080/objects/NE/assigneDevicesToNE' method='POST'>
                <DialogTitle>Add Device</DialogTitle>
                <DialogContent >
                    <DialogContentText style={{marginBottom: 20 }}>
                        Here you can add devices for the VM Server
                    </DialogContentText>
                    <InputLabel id="demo-multiple-chip-label">Select a devices from available:</InputLabel>
                    <Select style={{width: '100%' }}
                            name="devIds"
                        labelId="demo-multiple-chip-label"
                        id="demo-multiple-chip"
                        multiple
                        value={personName}
                        onChange={handleChange}
                        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={
                                        getNameFromNames(value)
                                    } />
                                ))}
                            </Box>
                        )}
                        MenuProps={MenuProps}
                    >
                        {names.map((name) => (
                            <MenuItem
                                key={name.id}
                                value={name.id}
                                text={name.name}
                                style={getStyles(name.name, personName, theme)}
                            >
                                {name.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <Input  name="neId" type="hidden"  margin="dense"  value={neId}  id="outlined-basic" label="neId" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type = "submit">Add</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}