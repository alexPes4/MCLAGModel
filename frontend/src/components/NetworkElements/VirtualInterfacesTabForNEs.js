import * as React from 'react';
import {useEffect, useState} from 'react';
import {DataGrid} from "@mui/x-data-grid";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import {Input, InputLabel, MenuItem, OutlinedInput, Select} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import {useTheme} from "@mui/material/styles";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Typography from "@mui/material/Typography";


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
async function deleteLAGs(neId) {
    let rows = document.getElementsByClassName("MuiDataGrid-row Mui-selected");
    let virtIntIdsForRelease = [];
    if (rows.length > 0) {
        console.log(rows);
        for (let i = 0; i < rows.length; i++) {
            virtIntIdsForRelease.push(rows[i].querySelector('[data-field="id"]').firstChild.textContent);
        }
    }
    var params = "";
    for (var i = 0; i < virtIntIdsForRelease.length; i++) {
        params += "&virtIntIds=" + virtIntIdsForRelease[i];
    }
    params += "&neId=" + neId;
    console.log(params);
    await fetch('http://localhost:8080/objects/NE/deleteLAGs?' + params).then(res=>res.text())
        .then((strings) => {
            window.location.href=strings;
        });
}
export default function VirtualInterfaceTabForNEs(props) {
    const objectNE=props.object;
    const neId=objectNE.objectId;
    const [rows, setRow] = useState([]);
    useEffect(  ()=>  {
            fetch("http://localhost:8080/objects/NE/getLAGsForNE?neId="+neId)
                .then(res=>res.json())
                .then((lags) => {
                    setRow(setRows(lags));
                });
        }, []
    );
    return (
        <div style={{width: '100%' }}>
            <Stack spacing={2} direction="row" style={{marginBottom: 10}}>
                <FormCreateVI locId={objectNE.parentId} neId={neId}></FormCreateVI>
                <Button variant="outlined" startIcon={<DeleteIcon/>} onClick={ () =>  {
                    deleteLAGs(neId);
                }}>Delete LAG</Button>
            </Stack>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
            />
        </div>
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
function FormCreateVI(props) {
    const neId = props.neId;
    const locId=props.locId;
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = async () => {
        let data = await getPortsToAssignOnNE(neId);
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
                Create LAG
            </Button>
            <Dialog open={open} onClose={handleClose} component="form" action='http://localhost:8080/objects/NE/createNewVI' method='POST'>
                <DialogTitle>Create LAG</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Here you can create new LAG in the NE
                    </DialogContentText>
                    <TextField name="name" autoFocus margin="dense" id="outlined-basic" label="Name" fullWidth variant="outlined" defaultValue="LAG"/>
                    <TextField   name="description" margin="dense" id="outlined-basic" label="Description" fullWidth variant="outlined" defaultValue="Link Aggregation Interface"/>
                    <InputLabel id="demo-multiple-chip-label">Select a devices from available:</InputLabel>
                    <Select style={{width: '100%' }}
                            name="portIds"
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
                    <Input  name="locId" type="hidden"  margin="dense"  value={locId}  id="outlined-basic" label="locId" />
                    <Input  name="neId" type="hidden"  margin="dense"  value={neId}  id="outlined-basic" label="neId" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type = "submit">Create</Button>
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
