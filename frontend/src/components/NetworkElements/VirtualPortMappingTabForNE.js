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
import AsynchronousSelect from "../MCLAGModel/AsynchronousSelect";
import {Input} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

async function deleteVPMsFromNE(neId) {
    let rows = document.getElementsByClassName("MuiDataGrid-row Mui-selected");
    let vpmIdsForDelete = [];
    if (rows.length > 0) {
        console.log(rows);
        for (let i = 0; i < rows.length; i++) {
            vpmIdsForDelete.push(rows[i].querySelector('[data-field="id"]').firstChild.textContent);
        }
    }
    var params = "";
    for (var i = 0; i < vpmIdsForDelete.length; i++) {
        params += "&vpmIds=" + vpmIdsForDelete[i];
    }
    params += "&neId=" + neId;
    console.log(params);
    await fetch('http://localhost:8080/objects/NE/deleteVPMs?' + params).then(res=>res.text())
        .then((strings) => {
            window.location.href=strings;
        });
}



function setRows(result) {
    let data=[]
    for(let i=0;i<result.length;i++){
        data.push({ id: result[i].object.objectId,
                    name: result[i].object.name,
                    interfaceOfServer: result[i].portOfVMServer,
                    VMServer: result[i].VMServer,
                    interfaceOfVirtualMachine: result[i].portOfVirtualMachine,
                    VirtualMachine: result[i].VirtualMachine

        })
    }
    return data;
}
const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 230, renderCell: (params) => (
            <Link href={`/${params.row.id}`}>{params.value}</Link>
        ) },
    { field: 'interfaceOfServer', headerName: 'Interface of VM Server', width: 230, renderCell: (params) => (
            <Link href={`/${params.value.objectId==null?null:params.value.objectId}`}>{params.value.name||null}</Link>
        ) },
    { field: 'VMServer', headerName: 'VM Server', width: 230, renderCell: (params) => (
            <Link href={`/${params.value.objectId==null?null:params.value.objectId}`}>{params.value.name||null}</Link>
        ) },
    { field: 'interfaceOfVirtualMachine', headerName: 'Interface of Virtual Machine', width: 230, renderCell: (params) => (
            <Link href={`/${params.value.objectId==null?null:params.value.objectId}`}>{params.value.name||null}</Link>
        ) },
    { field: 'VirtualMachine', headerName: 'Virtual Machine', width: 230, renderCell: (params) => (
            <Link href={`/${params.value.objectId==null?null:params.value.objectId}`}>{params.value.name||null}</Link>
        ) },
];
export default function VirtualPortMappingTabForNE(props) {
    const objectNE=props.object;
    const neId=objectNE.objectId;
    const [rows, setRow] = useState([]);
    useEffect(  ()=>  {
            fetch("http://localhost:8080/objects/NE/getVirtualPortMappings?neId="+neId)
                .then(res=>res.json())
                .then((ports) => {
                    setRow(setRows(ports));
                });
        }, []
    );
    return (
        <div style={{width: '100%' }}>
            <Stack spacing={2} direction="row" style={{marginBottom: 10}}>
                <FormDialogToCreateVirtualPortMapping locId={objectNE.parentId} neId={neId}></FormDialogToCreateVirtualPortMapping>
                <Button variant="outlined" startIcon={<DeleteIcon/>} onClick={ () =>  {
                    deleteVPMsFromNE(neId);
                }}>Delete Virtual Port Mapping</Button>
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

function FormDialogToCreateVirtualPortMapping(props) {
    const typeEP = null;
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
            <Button variant="outlined" onClick={handleClickOpen} startIcon={<AddCircleIcon/>}>
                Add Virtual Port Mapping
            </Button>
            <Dialog open={open} onClose={handleClose} component="form" action='http://localhost:8080/objects/NE/createNewVirtualPortMappings' method='POST'>
                <DialogTitle>Add Virtual Port Mapping</DialogTitle>
                <DialogContent>
                    <DialogContentText style={{marginBottom:15}}>
                        Here you can add new Add Virtual Port Mapping for the Network Element
                    </DialogContentText>
                    <DialogContentText>- Choose Interface Of VM Server:</DialogContentText>
                    <Stack spacing={2} direction="row" >
                        <AsynchronousSelect  typeId={typeEP} neId={neId} label={'VM Server'}/>
                        <AsynchronousSelect  typeId={typeEP} label={'Port of VM Server'}/>
                    </Stack>
                    <DialogContentText style={{marginTop:15}}>- Choose Interface Of Virtual Machine:</DialogContentText>
                    <Stack spacing={2} direction="row" >
                        <AsynchronousSelect  typeId={typeEP} neId={neId} label={'Virtual Machine'}/>
                        <AsynchronousSelect  typeId={typeEP} label={'Port of Virtual Machine'}/>
                    </Stack>
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
