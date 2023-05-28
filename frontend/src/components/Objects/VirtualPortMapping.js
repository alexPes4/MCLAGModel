import * as React from 'react';
import {useEffect, useState} from 'react';
import {DataGrid} from "@mui/x-data-grid";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import {Typography} from "@mui/material";
import Divider from "@mui/material/Divider";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import {TabList} from "@mui/lab";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";


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
export default function VirtualPortMapping(props) {
    const objectVPM=props.object;
    const [vpm, setVPM] = useState(null);
    const [rows, setRow] = useState([]);
    const [value, setValue] = React.useState("1");
    const handleChange =async (event, newValue) =>  {
        setValue(newValue);
    };
    useEffect(  ()=>  {
            fetch("http://localhost:8080/objects/NE/getVirtualPortMapping?vpmId="+objectVPM.objectId)
                .then(res=>res.json())
                .then((result) => {
                    setVPM(result);
                    console.log("vpm:");
                    console.log(vpm)
                });
        }, []
    );

    if (vpm == null) return null;
    return (
        <div style={{width: '100%' }}>
            <Box sx={{ width: '100%'}} style={{textAlign:"left"}}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider'}}  >
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                            <Tab label="Parameters" value="1"  />
                        </TabList>
                    </Box>
                    <TabPanel value="1">
                        <Grid container spacing={2} style={{width:800}}>
                            <Grid item xs={6}>
                                <Stack direction="row" spacing={1}>
                                    <Typography>Interface of VM Server: </Typography>
                                    <Typography><Link
                                        onClick={() => {
                                            console.info("I'm a button.");
                                        }}
                                        href={`/${vpm.portOfVMServer.objectId}`}
                                        name='Location3'
                                        value={vpm.portOfVMServer.objectId}
                                    >
                                        {vpm.portOfVMServer.name}
                                    </Link></Typography>

                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack direction="row" spacing={1}>
                                    <Typography>VM Server: </Typography>
                                    <Typography><Link
                                        onClick={() => {
                                            console.info("I'm a button.");
                                        }}
                                        href={`/${vpm.VMServer.objectId}`}
                                        name='Location4'
                                        value={vpm.VMServer.objectId}
                                    >
                                        {vpm.VMServer.name}
                                    </Link></Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack direction="row" spacing={1}>
                                    <Typography>Port of Virtual Machine: </Typography>
                                    <Typography><Link
                                        onClick={() => {
                                            console.info("I'm a button.");
                                        }}
                                        href={`/${vpm.portOfVirtualMachine.objectId}`}
                                        name='Location4'
                                        value={vpm.portOfVirtualMachine.objectId}
                                    >
                                        {vpm.portOfVirtualMachine.name}
                                    </Link></Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack direction="row" spacing={1}>
                                    <Typography>Virtual Machine: </Typography>
                                    <Typography><Link
                                        onClick={() => {
                                            console.info("I'm a button.");
                                        }}
                                        href={`/${vpm.VirtualMachine.objectId}`}
                                        name='Location4'
                                        value={vpm.VirtualMachine.objectId}
                                    >
                                        {vpm.VirtualMachine.name}
                                    </Link></Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack direction="row" spacing={1}>
                                    <Typography>Description: </Typography>
                                    <Typography>{vpm.object.description}</Typography>
                                </Stack>
                            </Grid>
                        </Grid>
                        <Divider style={{marginTop:15,marginBottom:15}} />
                    </TabPanel>
                </TabContext>
            </Box>
        </div>
    );

}
