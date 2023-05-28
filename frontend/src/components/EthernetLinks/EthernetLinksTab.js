import * as React from 'react';
import {useEffect, useState} from 'react';
import {DataGrid} from "@mui/x-data-grid";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import {Input} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";
import AsynchronousSelect from "../MCLAGModel/AsynchronousSelect";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from "@mui/icons-material/Delete";
import Stack from "@mui/material/Stack";

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


async function deleteEthernetLinks() {
    let rows = document.getElementsByClassName("MuiDataGrid-row Mui-selected");
    let ethLinksIdsForDelete = [];
    if (rows.length > 0) {
        for (let i = 0; i < rows.length; i++) {
            ethLinksIdsForDelete.push(rows[i].querySelector('[data-field="id"]').firstChild.textContent);
        }
    }
    var params = "";
    for (var i = 0; i < ethLinksIdsForDelete.length; i++) {
        params += "&ethLinksIds=" + ethLinksIdsForDelete[i];
    }
    params += "&riId=" + 1;
    console.log(params);
    await fetch('http://localhost:8080/objects/EthernetLinks/deleteEthernetLinks?' + params).then(res=>res.text())
        .then((strings) => {
            window.location.href=strings;
        });
}
export default function EthernetLinksTab(props) {
    const riId=props.riId;
    const [rows, setRow] = useState([]);
    useEffect(()=>{
            fetch("http://localhost:8080/objects/EthernetLinks/getAll")
                .then(res=>res.json())
                .then((result)=>{
                    setRow(setRows(result));
                })
        },[]

    )
    return (
        <div style={{width: '100%' }}>
            <FormDialogToCreateEthernetLink riId={riId}/>

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


function FormDialogToCreateEthernetLink(props) {
    const riId=props.riId;
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div >
            <Stack spacing={2} direction="row" style={{marginBottom: 10}}>
                <Button variant="outlined" startIcon={<AddCircleIcon/>} onClick={handleClickOpen} style={{marginBottom:15}}>
                    Create Ethernet Link
                </Button>
                <Button variant="outlined" startIcon={<DeleteIcon/>} onClick={ () =>  {
                    deleteEthernetLinks();
                }} style={{marginBottom:15}}>Delete Ethernet Links</Button>
            </Stack>
            <Dialog open={open} onClose={handleClose} component="form" action='http://localhost:8080/objects/EthernetLinks/createEthernetLink' method='POST'>
                <DialogTitle style={{ textAlign:'center'}}>Create Ethernet Link</DialogTitle>

                <DialogContent>

                    <DialogContentText style={{width:'100%', textAlign:'center'}}>
                        Here you can create new Ethernet Link
                    </DialogContentText>
                    <TextField name="name" autoFocus margin="dense" id="outlined-basic" label="Name" fullWidth variant="outlined"/>
                    <TextField   name="description" margin="dense" id="outlined-basic" label="Description" fullWidth variant="outlined"/>
                    <Grid container spacing={2} >

                        <Grid item xs={6}>
                            <DialogContentText>Here you can choose A location</DialogContentText>
                            <AsynchronousSelect   typeId="3" label={'Country'}/>
                        </Grid>
                        <Grid item xs={6}>
                            <DialogContentText>Here you can choose Z location</DialogContentText>
                            <AsynchronousSelect   typeId="4" label={'Country'}/>
                        </Grid>
                        <Grid item xs={6}>
                            <AsynchronousSelect  typeId={3} label={'City'}/>
                        </Grid>
                        <Grid item xs={6}>
                            <AsynchronousSelect  typeId={4} label={'City'}/>
                        </Grid>
                        <Grid item xs={6}>
                            <AsynchronousSelect  typeId={3} label={'Location'}/>
                        </Grid>
                        <Grid item xs={6}>
                            <AsynchronousSelect  typeId={4} label={'Location'}/>
                        </Grid>
                    </Grid>



                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type = "submit">Create</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
