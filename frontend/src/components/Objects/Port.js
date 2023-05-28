import * as React from 'react';
import {useEffect, useState} from 'react';
import {DataGrid} from "@mui/x-data-grid";
import Link from "@mui/material/Link";
import TabContext from "@mui/lab/TabContext";
import Box from "@mui/material/Box";
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
import AsynchronousSelect from "../MCLAGModel/AsynchronousSelect";
import {Input, MenuItem, Typography} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";


function setRows(result) {
    let data=[]
    for(let i=0;i<result.length;i++){
        console.log(result[i])
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

export default function Port(props) {
    const port=props.object;
    const [portObject, setPort] = React.useState();
    const [value, setValue] = React.useState("1");
    const handleChange =async (event, newValue) =>  {
        if (newValue==1) {
            // let data = await showPorts(objectId);
            // setRow(data);
            console.log("dfdf")
        }
        setValue(newValue);
    };
    useEffect(  ()=>   {
             fetch("http://localhost:8080/objects/Ports/getPort?portId="+port.objectId)
                .then(res=>res.json())
                .then((result) => {
                    setPort(result);
                    console.log(portObject);
                });
        }, []
    );
    if(portObject==null) return null;
    return (
        <Box sx={{width: '100%', typography: 'body1'}} style={{textAlign: "left"}}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider'}}  >
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="Parameters" value="1"  />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <div style={{ width: '100%' }}>
                        <Grid container spacing={2} style={{width:800}}>
                            <Grid item xs={3}>
                                <Stack direction="row" spacing={1}>
                                    <Typography variant="button" display="block" gutterBottom>
                                        Location:
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={9}>
                                {portObject.locationObj != null ? (
                                    <Typography variant="button" display="block" gutterBottom>
                                        <Link
                                            onClick={() => {
                                                console.info("I'm a button.");
                                            }}
                                            href={`/${portObject.locationObj.objectId}`}
                                            name='Location3'
                                            value={portObject.locationObj.objectId}
                                        >
                                            {portObject.locationObj.name}
                                        </Link>
                                    </Typography>
                                ) : ''}
                            </Grid>
                            <Grid item xs={3}>
                                <Stack direction="row" spacing={1}>
                                    <Typography variant="button" display="block" gutterBottom>
                                        Device:
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={9}>
                                {portObject.deviceObj != null ? (
                                    <Typography variant="button" display="block" gutterBottom>
                                        <Link
                                            onClick={() => {
                                                console.info("I'm a button.");
                                            }}
                                            href={`/${portObject.deviceObj.objectId}`}
                                            name='Location3'
                                            value={portObject.deviceObj.objectId}
                                        >
                                            {portObject.deviceObj.name}
                                        </Link>
                                    </Typography>
                                ) : ''}
                            </Grid>
                            <Grid item xs={3}>
                                <Stack direction="row" spacing={1}>
                                    <Typography variant="button" display="block" gutterBottom>
                                        LAG:
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={9}>
                                {portObject.interfacesObj != null ? (
                                    <Typography variant="button" display="block" gutterBottom>
                                        <Link
                                            onClick={() => {
                                                console.info("I'm a button.");
                                            }}
                                            href={`/${portObject.interfacesObj.objectId}`}
                                            name='Location3'
                                            value={portObject.interfacesObj.objectId}
                                        >
                                            {portObject.interfacesObj.name}
                                        </Link>
                                    </Typography>
                                ) : ''}
                            </Grid>
                            <Grid item xs={3}>
                                <Stack direction="row" spacing={1}>
                                    <Typography variant="button" display="block" gutterBottom>
                                        Circuit:
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={9}>
                                {portObject.circuitObj != null ? (
                                    <Typography variant="button" display="block" gutterBottom>
                                        <Link
                                            onClick={() => {
                                                console.info("I'm a button.");
                                            }}
                                            href={`/${portObject.circuitObj.objectId}`}
                                            name='Location3'
                                            value={portObject.circuitObj.objectId}
                                        >
                                            {portObject.circuitObj.name}
                                        </Link>
                                    </Typography>
                                ) : ''}
                            </Grid>
                            <Grid item xs={3}>
                                <Stack direction="row" spacing={1}>
                                    <Typography variant="button" display="block" gutterBottom>
                                        Virtual Port Mapping:
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={9}>
                                {portObject.vpmsList != null ? (
                                    <Typography variant="button" display="block" gutterBottom>
                                        {portObject.vpmsList.map((vpm) => (
                                            <Link
                                                onClick={() => {
                                                    console.info("I'm a button.");
                                                }}
                                                href={`/${vpm.objectId}`}
                                                name='Location3'
                                                value={vpm.objectId}
                                                style={{display:"block"}}
                                            >
                                                {vpm.name}
                                            </Link>
                                        ))}
                                    </Typography>
                                ) : ''}
                            </Grid>
                        </Grid>
                        <Divider style={{marginTop:15,marginBottom:15}} />
                    </div>
                </TabPanel>
            </TabContext>
        </Box>
    );

}

function FormDialogToSelectCarrierForEndPoint(props) {
    // const locId = props.locId;
    // const neId = props.neId;
    const modelId = props.modelId;
    const typeEP = props.typeEP;
    const pathElementId = props.pathElementId;
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button
                variant="outlined" onClick={handleClickOpen}>
                Select New Carrier
            </Button>
            <Dialog open={open} onClose={handleClose} component="form" action={`http://localhost:8080/objects/endPoints/selectNewCarrierForEP${(typeEP == 3) ? "A" : "Z"}`}method='POST'>
                <DialogTitle>Create End Point {(typeEP==3)?"A":"Z"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Here you can choose new Carrier {(typeEP==3)?"A":"Z"} for the MC-LAG Model
                    </DialogContentText>
                    <AsynchronousSelect  typeId={typeEP} mclagId={modelId} label={'Carrier For EP'}/>
                    {/*<TextField name="name" autoFocus margin="dense" id="outlined-basic" label="Name" fullWidth variant="outlined"/>*/}
                    {/*<TextField   name="description" margin="dense" id="outlined-basic" label="Description" fullWidth variant="outlined"/>*/}
                    <Input  name="epId" type="hidden"  margin="dense"  value={pathElementId}  id="outlined-basic" label="epId" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type = "submit">Select</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

function FormDialogToSelectResourceForEndPoint(props) {
    const modelId = props.modelId;
    const typeEP = props.typeEP;
    const carrierId = props.carrierId;
    const pathElementId = props.epId;
    console.log("carrierId:");
    console.log(carrierId)
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = (typeEP) => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button
                variant="outlined" onClick={handleClickOpen}>
                Select New Resource
            </Button>
            <Dialog open={open} onClose={handleClose} component="form" action={`http://localhost:8080/objects/endPoints/selectNewResourceForEP${(typeEP == 3) ? "A" : "Z"}`}method='POST'>
                <DialogTitle>Create End Point {(typeEP==3)?"A":"Z"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Here you can create new End Point {(typeEP==3)?"A":"Z"} for the MC-LAG Model
                    </DialogContentText>
                    <AsynchronousSelect  typeId={typeEP} carrierId={carrierId}  label={'Resource For EP'}/>
                    {/*<TextField name="name" autoFocus margin="dense" id="outlined-basic" label="Name" fullWidth variant="outlined"/>*/}
                    {/*<TextField   name="description" margin="dense" id="outlined-basic" label="Description" fullWidth variant="outlined"/>*/}
                    <Input  name="epId" type="hidden"  margin="dense"  value={pathElementId}  id="outlined-basic" label="epId" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type = "submit">Select</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

