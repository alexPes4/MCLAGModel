import * as React from 'react';
import {useEffect, useState} from 'react';
import {DataGrid} from "@mui/x-data-grid";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import {TabList} from "@mui/lab";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import {Input, InputLabel, MenuItem, OutlinedInput, Select} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import Chip from "@mui/material/Chip";
import {useTheme} from "@mui/material/styles";
import AddCircleIcon from '@mui/icons-material/AddCircle';



async function releasePorts(lagId) {
    let rows = document.getElementsByClassName("MuiDataGrid-row Mui-selected");
    let portIdsForRelease = [];
    if (rows.length > 0) {
        console.log(rows);
        for (let i = 0; i < rows.length; i++) {
            portIdsForRelease.push(rows[i].querySelector('[data-field="id"]').firstChild.textContent);
        }
    }
    var params = "";
    for (var i = 0; i < portIdsForRelease.length; i++) {
        params += "&portIds=" + portIdsForRelease[i];
    }
    params += "&lagId=" + lagId;
    console.log(params);
    await fetch('http://localhost:8080/objects/LAG/releasePorts?' + params).then(res=>res.text())
        .then((strings) => {
            window.location.href=strings;
        });
}
async function showPorts(lagId) {
    let data=[];
    await fetch("http://localhost:8080/objects/LAG/getAssignedPortsForLAG?lagId="+lagId)
        .then(res=>res.json())
        .then((ports) => {
            data= setRows(ports);
        });
    return data;
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
export default function VirtualInterface(props) {
    const lag=props.object;
    const [value, setValue] = React.useState("1");
    const [rows, setRow] = useState([]);
    const objectId=lag.objectId;
    const handleChange =async (event, newValue) =>  {
        if (newValue==1) {
            let data = await showPorts(objectId);
            setRow(data);
        }
        setValue(newValue);
    };
    useEffect(  ()=>  {
            fetch("http://localhost:8080/objects/LAG/getAssignedPortsForLAG?lagId="+lag.objectId)
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
                            <FormDialog deviceId={objectId} parentId={lag.parentId}></FormDialog>
                            <Button variant="outlined" startIcon={<DeleteIcon/>} onClick={ () =>  {
                                releasePorts(objectId);
                            }}>Release Ports</Button>
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
let names = [];
async function getPortsToAssignOnNE(neId){
    let data=[];
    await fetch("http://localhost:8080/objects/NE/getPortsToAssignOnVI?neId="+neId)
        .then(res=>res.json())
        .then((ports) => {
            data= setRows(ports);
            console.log("data:"+data);
        });

    return data;
}
function FormDialog(props) {
    const parentId =   props.parentId;
    const lagId=props.deviceId;
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = async () => {
        let data = await getPortsToAssignOnNE(parentId);
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
            <Button variant="outlined"  startIcon={<AddCircleIcon/>}  onClick={handleClickOpen}>
                Assign Port
            </Button>
            <Dialog open={open} onClose={handleClose} component="form" action='http://localhost:8080/objects/LAG/assignPortsToLAG' method='POST'>
                <DialogTitle>Assign Port</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Here you can assign new port for the LAG
                    </DialogContentText>
                    <InputLabel id="demo-multiple-chip-label">Select a devices from available:</InputLabel>
                    <Select style={{width: '100%', marginTop: 10 }}
                            name="portIds"
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            multiple
                            value={personName}
                            onChange={handleChange}
                            input={<OutlinedInput id="select-multiple-chip"/>}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}  >
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
                    <Input  name="lagId" type="hidden"  margin="dense"  value={lagId}  id="outlined-basic" label="deviceId" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type = "submit">Assign</Button>
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