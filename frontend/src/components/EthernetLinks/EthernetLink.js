import * as React from 'react';
import {useEffect, useState} from 'react';
import {Collapse, Input, Typography} from '@mui/material';
import {DataGrid} from "@mui/x-data-grid";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import TabContext from "@mui/lab/TabContext";
import Box from "@mui/material/Box";
import {TabList} from "@mui/lab";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Divider from '@mui/material/Divider';
import DeleteIcon from "@mui/icons-material/Delete";
import AsynchronousSelect from "../MCLAGModel/AsynchronousSelect";
import Alert from "@mui/material/Alert";
import CloseIcon from '@mui/icons-material/Close'
import IconButton from "@mui/material/IconButton";

async function deleteEndPoints(mclagModel) {
    let rows = document.getElementById("endPointsTable").getElementsByClassName("MuiDataGrid-row Mui-selected");
    let epIdsForDelete = [];
    console.log(rows)
    if (rows.length > 0) {
        console.log(rows);
        for (let i = 0; i < rows.length; i++) {
            epIdsForDelete.push(rows[i].querySelector('[data-field="id"]').firstChild.textContent);
        }
    }
    var params = "";
    for (var i = 0; i < epIdsForDelete.length; i++) {
        params += "&epIds=" + epIdsForDelete[i];
    }
    params += "&mclagId=" + mclagModel;
    console.log(params);
    await fetch('http://localhost:8080/objects/endPoints/deleteEPs?' + params).then(res=>res.text())
        .then((strings) => {
            window.location.href=strings;
        });
}

function setRows(result) {
    let data=[]
    for(let i=0;i<result.length;i++){
        if(result[i].carrier==null){
            result[i].carrier = {objectId:'', name:'',description:''}
        }
        if(result[i].resource==null){
            result[i].resource = {objectId:'', name:'',description:''}
        }
        data.push({ id: result[i].object.objectId, name: result[i].object.name, carrier: result[i].carrier, resource: result[i].resource})
    }
    return data;
}

function setRowsEP(result) {
    let data=[]
    for(let i=0;i<result.length;i++){
        console.log(result[i].objectId+"|"+result[i].name+"|"+result[i].description);
        data.push({ id: result[i].objectId, name: result[i].name, description: result[i].description})
    }
    return data;
}
async function getEndPoint(typeEP, ethLink) {
    let data =[];
    await fetch("http://localhost:8080/objects/EthernetLinks/getEndPoint?ethLink="+ethLink+"&typeEP="+typeEP)
        .then(res=>res.json())
        .then((result) => {
            data= setRowsEP(result);
        });
    return data;
}

const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 230, renderCell: (params) => (
            <Link href={`/${params.row.id}`}>{params.value}</Link>
        ) },
    { field: 'carrier', headerName: 'Carrier', width: 330, renderCell: (params) => (
            <Link href={`/${params.value.objectId==null?null:params.value.objectId}`}>{params.value.name||null}</Link>
        ) },
    { field: 'resource', headerName: 'Resource', width: 330, renderCell: (params) => (
            <Link href={`/${params.value.objectId==null?null:params.value.objectId}`}>{params.value.name||null}</Link>
        ) }
];


export default function EthernetLink(props) {
    const object=props.object;
    const [value, setValue] = React.useState("1");

    const [open, setOpen] = React.useState(false);
    const [mclagObj, setMCLAG] = useState(null);
    const [endPoints, setEP] = useState([]);
    const [pathElements, setPE] = useState([]);
    const handleChange =async (event, newValue) =>  {
        setValue(newValue);
    };
    useEffect(   ()=>  {
            (async()=>{
                const data = await fetch("http://localhost:8080/objects/MCLAG/getMCLAGModel?mclagId="+object.objectId);
                const response = await data.json();
                setMCLAG(response);
                setEP(setRows(response.endPoints));
                //await setEP(setRows(mclagObj.endPoints));
            })();


        }, []
    );
    if (mclagObj === null) {
        return null;
    }


    return (
        <Box sx={{ width: '100%'}} style={{textAlign:"left"}}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider'}}  >
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="Path Elements" value="1"  />
                        <Tab label="Parameters" value="2"  />
                    </TabList>
                </Box>

                <TabPanel value="1">
                    <Grid container spacing={2} style={{width:500}}>
                        <Grid item xs={6}>
                            <Stack direction="row" spacing={1}>
                                <Typography>Location A :</Typography>
                                <Typography><Link
                                    onClick={() => {
                                        console.info("I'm a button.");
                                    }}
                                    href={`/${mclagObj.locA.objectId}`}
                                    name='Location3'
                                    value={mclagObj.locA.objectId}
                                >
                                    {mclagObj.locA.name}
                                </Link></Typography>

                            </Stack>
                        </Grid>
                        <Grid item xs={6}>
                            <Stack direction="row" spacing={1}>
                                <Typography>Location Z :</Typography>
                                <Typography><Link
                                    onClick={() => {
                                        console.info("I'm a button.");
                                    }}
                                    href={`/${mclagObj.locZ.objectId}`}
                                    name='Location4'
                                    value={mclagObj.locZ.objectId}
                                >
                                    {mclagObj.locZ.name}
                                </Link></Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <Stack direction="row" spacing={1}>
                                <Typography>Description: </Typography>
                                <Typography>{mclagObj.object.description}</Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                    <Divider style={{marginTop:15,marginBottom:15}} />
                    <Typography variant="button" display="block" gutterBottom>
                        End  Points
                    </Typography>
                    <Collapse in={open}>
                    <Alert
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                id="notification"
                                onClick={() => {
                                    setOpen(false);
                                }}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                        sx={{ mb: 2 }}
                        severity="info"
                        style={{marginBottom:10}}>The Ethernet Link can to has only one 'End Point A' and one 'End Point Z'</Alert>

                    </Collapse>
                        <Stack spacing={2} direction="row" style={{marginBottom: 10}}>
                        <FormDialogToCreateEndPoint object={object} notClick={setOpen}/>
                        <Button variant="outlined" startIcon={<DeleteIcon/>} onClick={ () =>  {
                            deleteEndPoints(mclagObj.object.objectId);
                        }}>Delete End Points</Button>
                    </Stack>
                    <div style={{ width: '100%', marginTop:10 }}
                         id="endPointsTable">
                        <DataGrid
                            rows={endPoints}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            checkboxSelection
                        />
                    </div>
                    {object.typeId == 2?(
                        <div>
                            <Typography variant="button" display="block" gutterBottom style={{marginTop:15}} >
                                Path Elements
                            </Typography>
                            <Stack spacing={2} direction="row" style={{marginBottom: 10}}>
                                <FormDialogToCreateEndPoint object={object}/>
                                <Button variant="outlined" startIcon={<DeleteIcon/>} onClick={ () =>  {
                                    deleteEndPoints(mclagObj.object.objectId);
                                }}>Delete Path Elements</Button>
                            </Stack>
                            <div style={{ width: '100%'}}
                                 id="pathElementsTable">
                                <DataGrid
                                    rows={pathElements}
                                    columns={columns}
                                    pageSize={5}
                                    rowsPerPageOptions={[5]}
                                    checkboxSelection
                                />
                            </div>
                        </div>
                    ):(<></>)}

                </TabPanel>
                <TabPanel value="2">
                    Parameters
                </TabPanel>
            </TabContext>
            </Box>
    );

}


function AddPoints(props){
    const [anchorEl, setAnchorEl] = React.useState(null);
    const onClickA = async () => {
        let epObj = await getEndPoint(3, props.ethLink);
        if (epObj.length>0) props.notClick(true);
        else props.onClick(3);
    }
    const onClickZ = async () => {
        let epObj = await getEndPoint(4, props.ethLink);
        if (epObj.length > 0) props.notClick(true);
        else props.onClick(4);
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
                Add End Point
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
                <MenuItem onClick={onClickA}>Add End Point A</MenuItem>
                <MenuItem onClick={onClickZ}>Add End Point Z</MenuItem>
            </Menu>
        </div>
    )
}


function FormDialogToCreateEndPoint(props) {
    // const locId = props.locId;
    // const neId = props.neId;
    const ethLinkObj = props.object;
    const [open, setOpen] = React.useState(false);
    const [typeEP, setEP] = React.useState();
    const handleClickOpen = (typeEP) => {
        setOpen(true);
        console.log("typeEP:"+typeEP);
        setEP(typeEP);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <AddPoints variant="contained" onClick={handleClickOpen} notClick={props.notClick} ethLink={ethLinkObj.objectId} >
            </AddPoints>
            <Dialog open={open} onClose={handleClose} component="form" action={`http://localhost:8080/objects/endPoints/createEP${(typeEP==3)?"A":"Z"}`}method='POST'>
                <DialogTitle>Create End Point {(typeEP==3)?"A":"Z"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Here you can create new End Point {(typeEP==3)?"A":"Z"} for the Ethernet Link
                    </DialogContentText>
                    <AsynchronousSelect  typeId={typeEP} label={'Carrier'}/>
                    <AsynchronousSelect  typeId={typeEP} label={'Resource'} ethernetLink={ethLinkObj}/>
                    {/*<TextField name="name" autoFocus margin="dense" id="outlined-basic" label="Name" fullWidth variant="outlined"/>*/}
                    {/*<TextField   name="description" margin="dense" id="outlined-basic" label="Description" fullWidth variant="outlined"/>*/}
                    <Input  name="mcLag" type="hidden"  margin="dense"  value={ethLinkObj.objectId}  id="outlined-basic" label="modelId" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type = "submit">Create</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}


function FormDialogToCreatePathElements(props) {
    // const locId = props.locId;
    // const neId = props.neId;
    const modelId = props.object.objectId;
    const [open, setOpen] = React.useState(false);
    const [typeEP, setEP] = React.useState();
    const handleClickOpen = (typeEP) => {
        setOpen(true);
        console.log("typeEP:"+typeEP);
        setEP(typeEP);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <AddPoints variant="contained" onClick={handleClickOpen}>
            </AddPoints>
            <Dialog open={open} onClose={handleClose} component="form" action={`http://localhost:8080/objects/endPoints/createEP${(typeEP==3)?"A":"Z"}`}method='POST'>
                <DialogTitle>Create Path Element {(typeEP==3)?"A":"Z"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Here you can create new Path Element {(typeEP==3)?"A":"Z"} for the MC-LAG Model
                    </DialogContentText>
                    <AsynchronousSelect  typeId={typeEP} label={'Carrier'}/>
                    <AsynchronousSelect  typeId={typeEP} label={'Resource'}/>
                    {/*<TextField name="name" autoFocus margin="dense" id="outlined-basic" label="Name" fullWidth variant="outlined"/>*/}
                    {/*<TextField   name="description" margin="dense" id="outlined-basic" label="Description" fullWidth variant="outlined"/>*/}
                    <Input  name="mcLag" type="hidden"  margin="dense"  value={modelId}  id="outlined-basic" label="modelId" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type = "submit">Create</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

