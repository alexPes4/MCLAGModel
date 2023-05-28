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
import {Input} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import AddCircleIcon from '@mui/icons-material/AddCircle';
async function deleteVMsFromNE(neId) {
    let rows = document.getElementsByClassName("MuiDataGrid-row Mui-selected");
    let vmIdsForDelete = [];
    if (rows.length > 0) {
        console.log(rows);
        for (let i = 0; i < rows.length; i++) {
            vmIdsForDelete.push(rows[i].querySelector('[data-field="id"]').firstChild.textContent);
        }
    }
    var params = "";
    for (var i = 0; i < vmIdsForDelete.length; i++) {
        params += "&vmIds=" + vmIdsForDelete[i];
    }
    params += "&neId=" + neId;
    console.log(params);
    await fetch('http://localhost:8080/objects/NE/deleteVMs?' + params).then(res=>res.text())
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
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 230, renderCell: (params) => (
            <Link href={`/${params.row.id}`}>{params.value}</Link>
        ) },
    { field: 'description', headerName: 'Description', width: 330 }
];
export default function VirtualMachineTabForNE(props) {
    const objectNE=props.object;
    const neId=objectNE.objectId;
    const [rows, setRow] = useState([]);
    useEffect(  ()=>  {
            fetch("http://localhost:8080/objects/NE/getVMsForNE?neId="+neId)
                .then(res=>res.json())
                .then((ports) => {
                    setRow(setRows(ports));
                });
        }, []
    );
    return (
        <div style={{ width: '100%' }}>
            <Stack spacing={2} direction="row" style={{marginBottom: 10}}>
                <FormDialogToCreateVM locId={objectNE.parentId} neId={neId}></FormDialogToCreateVM>
                <Button variant="outlined" startIcon={<DeleteIcon/>} onClick={ () =>  {
                    deleteVMsFromNE(neId);
                }}>Delete VM</Button>
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


function FormDialogToCreateVM(props) {
    const locId = props.locId;
    const neId = props.neId;
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
                Create VM
            </Button>
            <Dialog open={open} onClose={handleClose} component="form" action='http://localhost:8080/objects/NE/createNewVM' method='POST'>
                <DialogTitle>Create Virtual Machine</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Here you can create new Virtual Machine for the Network Element
                    </DialogContentText>
                    <TextField name="name" autoFocus margin="dense" id="outlined-basic" label="Name" fullWidth variant="outlined" defaultValue="Virtual Machine"/>
                    <TextField   name="description" margin="dense" id="outlined-basic" label="Description" fullWidth variant="outlined" defaultValue="Description of the virtual machine"/>
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
