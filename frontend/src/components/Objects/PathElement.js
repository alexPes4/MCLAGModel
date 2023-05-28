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
import {Input, Typography} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";


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

export default function PathElement(props) {
    const peObj=props.object;
    const typeEP = peObj.typeId;
    const modelId=peObj.parentId;
    const [pathElement, setPE] = useState([]);
    const [carrier, setCarrier] = useState([]);
    const [carrierId, setCarrierId] = useState(null);
    const [resource, setResource] = useState([]);
    const [value, setValue] = React.useState("1");
    const handleChange =async (event, newValue) =>  {
        if (newValue==1) {
            // let data = await showPorts(objectId);
            // setRow(data);
        }
        setValue(newValue);
    };
    useEffect(  ()=>  {
            fetch("http://localhost:8080/objects/endPoints/getObject?peId="+peObj.objectId)
                .then(res=>res.json())
                .then((pathElement) => {
                    let carrier = [];
                    carrier.push(pathElement.carrier);
                    setCarrier(setRows(carrier));
                    setCarrierId(pathElement.carrier.objectId);
                    let resource = [];
                    resource.push(pathElement.resource);
                    setResource(setRows(resource));
                    setPE(pathElement);
                });
        }, []
    );
    if (pathElement==null||carrier==null){
        return null;
    }
    function getCarrierId(){
        return carrier.objectId;
    }
    return (
        <Box sx={{width: '100%', typography: 'body1'}} style={{textAlign: "left"}}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider'}}  >
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="Working Path" value="1"  />
                        <Tab label="Parameters" value="2" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <div style={{ width: '100%' }}>

                        <Typography variant="button" display="block" gutterBottom>
                            Carrier
                        </Typography>
                        <Stack spacing={2} direction="row" style={{marginBottom: 10}}>
                            <FormDialogToSelectCarrierForEndPoint modelId={modelId} typeEP={typeEP} pathElementId={peObj.objectId}></FormDialogToSelectCarrierForEndPoint>
                        </Stack>
                        <div style={{ width: '100%', marginTop:10,marginBottom: 20 }}
                             id="endPointsTable">
                            <DataGrid
                                rows={carrier}
                                columns={columns}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                checkboxSelection
                            />
                        </div>
                        <Typography variant="button" display="block" gutterBottom>
                            Resource
                        </Typography>
                        <Stack spacing={2} direction="row" style={{marginBottom: 10}}>
                            <FormDialogToSelectResourceForEndPoint modelId={modelId} typeEP={typeEP} epId={peObj.objectId} carrierId={carrierId} ></FormDialogToSelectResourceForEndPoint>
                        </Stack>
                        <div style={{ width: '100%', marginTop:10 }}
                             id="pathElementsTable">
                            <DataGrid
                                rows={resource}
                                columns={columns}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                checkboxSelection
                            />
                        </div>
                    </div>
                </TabPanel>
                <TabPanel value="2">
                    Parameters
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

