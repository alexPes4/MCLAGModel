import * as React from 'react';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import BreadCrumbsTop from "./Objects/BreadCrumbsTop";
import Button from '@mui/material/Button';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import {TabList} from "@mui/lab"; // Grid version 2
import {DataGrid} from '@mui/x-data-grid';
import Link from "@mui/material/Link";
import {Input} from "@mui/material";
import MCLAGmodelsTab from "./MCLAGModel/MCLAGmodelsTab";
import EthernetLinksTab from "./EthernetLinks/EthernetLinksTab";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import AddCircleIcon from '@mui/icons-material/AddCircle';

async function showAllCountries() {
    let data=[];
    await fetch("http://localhost:8080/objects/countries")
        .then(res=>res.json())
        .then((countries) => {
            data= setRows(countries);
        });
    return data;
}

async function showLAGmodels() {
    let data=[];
    await fetch("http://localhost:8080/objects/LAGModels")
        .then(res=>res.json())
        .then((devices) => {
            console.log("devices: " + devices);
            console.log(setRows(devices));
            data= setRows(devices);
        });
    return data;
}
//onClick={() => {showLAGmodels();}}
async function showDevices() {
    /*("http://localhost:8080/objects/Devices", "GET").then((devices) => {
        console.log("devices: "+devices);
        return setRows(devices);
    });*/
    let data=[];
    await fetch("http://localhost:8080/objects/Devices")
        .then(res=>res.json())
        .then((devices) => {
            console.log("devices: " + devices);
            console.log(setRows(devices));
            data= setRows(devices);
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
    { field: 'name', headerName: 'Name', width: 500, renderCell: (params) => (
            <Link href={`/${params.row.id}`}>{params.value}</Link>
        ) },
    { field: 'description', headerName: 'Description', width: 330 }
];
export default function ResourceInventory() {
    const [rows, setRow] = useState([]);
    const handleChange =async (event, newValue) =>  {
        console.log("newValue:"+newValue);
        if (newValue==1) {
            let data = await showAllCountries();
            setRow(data);
        }
        else if (newValue==2) {
            let data = await showLAGmodels();
            setRow(data);
        }
        else if (newValue==5){
            let data = await showDevices();
            setRow(data);
        }
        setValue(newValue);
    };
    useEffect(()=>{
            // fetch("http://localhost:8080/objects/LAGModels")
            //     .then(res=>res.json())
            //     .then((result)=>{
            //         console.log("RESULT ONLOAD:");
            //
            //         console.log("RESULT:"+result);
            //         console.log("setRows:"+setRows(result));
            //         setRow(setRows(result));
            //     });
        handleChange(null,"1");
        },[]

    )
    const [value, setValue] = React.useState("1");
    return (
        <Box sx={{ width: '100%', typography: 'body1'}} style={{textAlign:"left"}}>
            <BreadCrumbsTop/>
            <Button href={'/'}>Resource Inventory</Button>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider'}}  >
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="Countries" value="1"  />
                        <Tab label="Models" value="2"  />
                        <Tab label="Ethernet Links" value="4" />
                        <Tab label="Devices"   value="5" />
                    </TabList>
                </Box>

                <TabPanel value="1">
                        <div style={{ width: '100%' }}>
                            <FormDialogToCreateCountry/>
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
                    <MCLAGmodelsTab riId={1}/>
                </TabPanel>
                <TabPanel value="4">
                    <EthernetLinksTab riId={1}/>
                </TabPanel>
                <TabPanel value="5">
                    <div style={{ width: '100%' }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            checkboxSelection
                        />
                    </div>
                </TabPanel>
            </TabContext>
        </Box>

    );
}


function FormDialogToCreateCountry(props) {

    //const object=props.object;
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button variant="outlined" startIcon={<AddCircleIcon/>} style={{marginBottom:15}} onClick={handleClickOpen}>
                Add Country
            </Button>
            <Dialog open={open} onClose={handleClose} component="form"
                    action='http://localhost:8080/objects/createCountry' method='POST'>
                <DialogTitle>Add Country</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Here you can add new country in Resource Inventory
                    </DialogContentText>
                    <TextField name="name" autoFocus margin="dense" id="outlined-basic" label="Name" fullWidth variant="outlined"/>
                    <TextField   name="description" margin="dense" id="outlined-basic" label="Description" fullWidth variant="outlined"/>
                    <Input  name="parentId" type="hidden"  margin="dense"  value={1}  id="outlined-basic" label="deviceId" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type = "submit">Add</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}