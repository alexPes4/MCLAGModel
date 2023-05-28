import * as React from 'react';
import {useEffect, useState} from 'react';
import {Input, Slide, Typography} from '@mui/material';
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
import AsynchronousSelect from "./AsynchronousSelect";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Divider from '@mui/material/Divider';
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import {Checkbox, Tooltip} from "@mui/joy";
import Badge from "@mui/joy/Badge";


import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

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

async function deletePathElements(mclagModel) {
    let rows = document.getElementById("pathElementsTable").getElementsByClassName("MuiDataGrid-row Mui-selected");
    let peIdsForDelete = [];
    console.log(rows)
    if (rows.length > 0) {
        console.log(rows);
        for (let i = 0; i < rows.length; i++) {
            peIdsForDelete.push(rows[i].querySelector('[data-field="id"]').firstChild.textContent);
        }
    }
    var params = "";
    for (var i = 0; i < peIdsForDelete.length; i++) {
        params += "&peIds=" + peIdsForDelete[i];
    }
    params += "&mclagId=" + mclagModel;
    console.log(params);
    await fetch('http://localhost:8080/objects/endPoints/deletePEs?' + params).then(res=>res.text())
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
export default function MCLAGmodel(props) {
    const object=props.object;
    const [value, setValue] = React.useState("1");
    const [mclagObj, setMCLAG] = useState(null);
    const [endPoints, setEP] = useState([]);
    const [pathElements, setPE] = useState([]);
    const handleChange =async (event, newValue) =>  {
        setValue(newValue);
    };
    const handleCompleteButton = ()=>{
        changeStatus(mclagObj.object.objectId,'Completed')
        }
    useEffect(   ()=>  {
        (async()=>{
                const data = await fetch("http://localhost:8080/objects/MCLAG/getMCLAGModel?mclagId="+object.objectId);
                const response = await data.json();
                setMCLAG(response);
            setEP(setRows(response.endPoints));
            setPE(setRows(response.pathElements));
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
                    <Stack spacing={2} direction="row" style={{marginBottom: 10, width:"100%"}}>
                        <Grid container spacing={2} style={{width: 600}}>
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

                            <Grid item xs={12} >
                                <Stack direction="row" spacing={1} style={{alignItems: "baseline"}}>
                                    <Typography>Status: {}</Typography>
                                    <ReturnStatusTo status={mclagObj.status} mclagId={mclagObj.object.objectId}/>
                                </Stack>
                            </Grid>
                        </Grid>
                        <Grid container justifyContent="center">
                            <Grid item container alignItems="flex-end" direction="column">
                                <Grid item>
                                    <Tooltip title="Add" >
                                        <DialogSlideAssignModel mclagObj={mclagObj}/>
                                    </Tooltip>
                                    <div style={{textAlign:"center", marginTop:"15px"}}>
                                        <Button variant="outlined" color="success" disabled={mclagObj.status== 'Ready To Complete'?false:true} onClick={handleCompleteButton} style={{width:"100%"}}>Complete</Button>
                                    </div>

                                </Grid>
                            </Grid>
                        </Grid>
                    </Stack>
                    <Divider style={{marginTop:15,marginBottom:15}} />
                    <Typography variant="button" display="block" gutterBottom>
                        End  Points
                    </Typography>
                    <Stack spacing={2} direction="row" style={{marginBottom: 10}}>
                        <FormDialogToCreateEndPoint object={object}/>
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
                    <Typography variant="button" display="block" gutterBottom style={{marginTop:15}} >
                        Path Elements
                    </Typography>
                    <Stack spacing={2} direction="row" style={{marginBottom: 10}}>
                        <FormDialogToCreatePathElements object={object}/>
                        <Button variant="outlined" startIcon={<DeleteIcon/>} onClick={ () =>  {
                            deletePathElements(mclagObj.object.objectId);
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
    const onClickA = ()=>{
        props.onClick(3);
    }
    const onClickZ = ()=>{
        props.onClick(4);
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
                <DialogTitle>Create End Point {(typeEP==3)?"A":"Z"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Here you can create new End Point {(typeEP==3)?"A":"Z"} for the MC-LAG Model
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

function FormDialogToCreatePathElements(props) {
    const typeEP = 5;
    const mclagId = props.object.objectId;
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                Add Path Element
            </Button>
            <Dialog open={open} onClose={handleClose} component="form" action='http://localhost:8080/objects/MCLAG/createPathElement' method='POST'>
                <DialogTitle>Create Path Element</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Here you can create new Path Element for the MC-LAG Model
                    </DialogContentText>
                    <AsynchronousSelect  typeId={typeEP} label={'Ethernet Link'}/>
                    <Input  name="mclagId" type="hidden"  margin="dense"  value={mclagId}  id="outlined-basic" label="mclagId" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type = "submit">Create</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}



const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

async function changeStatus(mclagId, status) {
    await fetch('http://localhost:8080/objects/MCLAG/changeStatus?mclagId=' + mclagId+'&status='+status).then(res=>res.text())
        .then((strings) => {
            window.location.href=strings;
        });
}


function DialogSlideAssignModel(props) {
    const mclagObj = props.mclagObj
    const [readyToComplete, setReady] = React.useState(mclagObj.status=='Ready To Complete'?true:false);
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleAssignTasks = () => {
        setOpen(false);
        changeStatus(mclagObj.object.objectId,'In Progress');

    };
    const handleReadyToComplete = () => {
        setOpen(false);
        changeStatus(mclagObj.object.objectId,'Ready To Complete');

    };
    const handleComplete = () => {
        setOpen(false);
        changeStatus(mclagObj.object.objectId,'Completed');

    };
    const handleCompleteButton = () => {
        //
    };
    const handleChange = (event) => {
        let switches = document.getElementsByClassName("switchCustom");
        let ready = true;
        for(let i=0; i<switches.length;i++){
            console.log(switches[i].getElementsByTagName('input')[0].checked)
            if(!switches[i].getElementsByTagName('input')[0].checked){
                ready = false;
                break;
            }
        }
        if(ready)
        console.log("Ready to complete");
        setReady(ready);
    };

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                Work Order
            </Button>


            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>Work Order Status</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description" style={{marginBottom: "10px"}}>
                        There should be a description of how the model should be configured. This description comes from an external system. According to this description, different departments perform their own list of work tasks.
                    </DialogContentText>
                    <Stack spacing={2} direction="row">
                        <Typography style={{width: "100%", margin: "10px 0px"}}>
                            Department №1
                        </Typography>
                        {mclagObj.status != 'In Planned' ? (
                            <Switch className="switchCustom" onChange={handleChange} defaultChecked color="success" disabled={mclagObj.status != 'In Progress'?true:false}/>
                        ) : ''}

                    </Stack>
                    <Stack spacing={2} direction="row">
                        <Typography style={{width: "100%", margin: "10px 0px"}}>
                            Department №2
                        </Typography>
                        {mclagObj.status != 'In Planned' ? (
                            <Switch className="switchCustom" onChange={handleChange} defaultChecked color="success" disabled={mclagObj.status != 'In Progress'?true:false}/>
                        ) : ''}
                    </Stack>
                    <Stack spacing={2} direction="row">
                        <Typography style={{width: "100%", margin: "10px 0px"}}>
                            Department №3
                        </Typography>
                        {mclagObj.status != 'In Planned' ? (
                            <Switch className="switchCustom" onChange={handleChange} defaultChecked color="success" disabled={mclagObj.status != 'In Progress'?true:false}/>
                        ) : ''}
                    </Stack>
                    <Stack spacing={2} direction="row">
                        <Typography style={{width: "100%", margin: "10px 0px"}}>
                            Department №4
                        </Typography>
                        {mclagObj.status != 'In Planned' ? (
                            <Switch className="switchCustom" defaultChecked={mclagObj.status != 'In Progress'?true:false} onChange={handleChange} color="success" disabled={mclagObj.status != 'In Progress'?true:false}/>
                        ) : ''}
                    </Stack>


                </DialogContent>
                <DialogActions>
                    <Button disabled={mclagObj.status== 'In Planned'?false:true} onClick={handleAssignTasks} color="secondary">Assign tasks</Button>
                    <Button disabled={(readyToComplete&&(mclagObj.status== 'In Progress'))?false:true} onClick={handleReadyToComplete}>Ready To Complete</Button>
                    <Button disabled={mclagObj.status== 'Ready To Complete'?false:true} onClick={handleComplete} >Complete</Button>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}



function ReturnStatusTo(props){
    let mclagId = props.mclagId;
    let status = props.status;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const onClickA = ()=>{
        props.onClick(3);
    }
    const onClickZ = ()=>{
        props.onClick(4);
    }
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const invokeChangeStatus = (event) => {
        changeStatus(mclagId, event.target.textContent);
    }
    return (
        <div>
            {status=='In Planned'?(
                <Button id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        variant="outlined" color="error" style={{padding: "1px 5px"}}>
                    {status}
                </Button>
            ):status=='In Progress'?(
                <Button id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        variant="outlined"
                        color="secondary" style={{padding: "1px 5px"}}>
                    {status}
                </Button>
            ):status=='Ready To Complete'?(
                <Button id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        variant="outlined"
                        color="info" style={{padding: "1px 5px"}}>
                    {status}
                </Button>
            ):status=='Completed'?(
                <Button id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        variant="outlined"
                        color="success" style={{padding: "1px 5px"}}>
                    {status}
                </Button>
            ):''}
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >

                <MenuItem disabled={true} style={{opacity:1}}>Return Status To:</MenuItem>
                <Divider style={{margin:0}}></Divider>
                {status!='In Planned'?(
                    <MenuItem onClick={invokeChangeStatus}>In Planned</MenuItem>
                ):''}
                {status!='In Progress'?(
                    <MenuItem onClick={invokeChangeStatus}>In Progress</MenuItem>
                ):''}
                {status!='Ready To Complete'?(
                    <MenuItem onClick={invokeChangeStatus}>Ready To Complete</MenuItem>
                ):''}
                {status!='Completed'?(
                    <MenuItem onClick={invokeChangeStatus}>Completed</MenuItem>
                ):''}
            </Menu>
        </div>
    )
}

