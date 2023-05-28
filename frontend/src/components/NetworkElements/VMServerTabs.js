import * as React from 'react';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import {TabList} from "@mui/lab";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import {DataGrid} from "@mui/x-data-grid";
import TabContext from "@mui/lab/TabContext";
import Link from "@mui/material/Link";
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {InputLabel, MenuItem, OutlinedInput, Select} from "@mui/material";
import Chip from "@mui/material/Chip";
import {useTheme} from '@mui/material/styles';
import DevicesTableForNEDevices from "./DevicesTableForNEDevices";
import PortsTabForNE from "./PortsTabForNE";
import VirtualInterfaceTabForNEs from "./VirtualInterfacesTabForNEs";
import VirtualMachineTabForNE from "./VirtualMachineTabForNE";
import VirtualPortMappingTabForNE from "./VirtualPortMappingTabForNE";
import DevicesTableForNEVMServer from "./DevicesTableForNEVMServer";

async function showPorts(deviceId) {
    let data=[];
    await fetch("http://localhost:8080/objects/portsForDevice?deviceId="+deviceId)
        .then(res=>res.json())
        .then((ports) => {
            data= setRows(ports);
        });
    return data;
}

async function deletePort(deviceId) {
    let rows = document.getElementsByClassName("MuiDataGrid-row Mui-selected");
    let portIdsForDelete = [];
    if (rows.length > 0) {
        console.log(rows);
        for (let i = 0; i < rows.length; i++) {
            portIdsForDelete.push(rows[i].querySelector('[data-field="id"]').firstChild.textContent);
        }
    }
    var params = "";
    for (var i = 0; i < portIdsForDelete.length; i++) {
        params += "&portIds=" + portIdsForDelete[i];
    }
    params += "&deviceId=" + deviceId;
    await fetch('http://localhost:8080/objects/deletePorts?' + params).then(res=>res.text())
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
export default function VMServerTabs(props) {

    const [value, setValue] = React.useState("1");
    const [rows, setRow] = useState([]);
    const object=props.object;
    const objectId=object.objectId;
    const handleChange =async (event, newValue) =>  {
        if (newValue==1) {
            let data = await showPorts(objectId);
            setRow(data);
        }
        setValue(newValue);
    };
    useEffect(  ()=>  {
            fetch("http://localhost:8080/objects/portsForDevice?deviceId="+objectId)
                .then(res=>res.json())
                .then((ports) => {
                    setRow(setRows(ports));
                });
        }, []
    );
    return (
        <Box sx={{width: '100%', typography: 'body1'}} style={{textAlign: "left"}}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider'}}  >
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="Devices" value="1"  />
                        {(object.typeId==9)?(
                            <Tab label="Virtual Machines" value="2" />
                        ):('')}
                        <Tab label="Ports" value="3" />
                        {(object.typeId==9)?(
                        <Tab label="Virtual Port Mapping" value="4" />
                        ):('')}
                        <Tab label="Virtual Interfaces" value="5" />
                        <Tab label="Parameters" value="6" />
                    </TabList>
                </Box>
                {(object.typeId==9)?(
                    <TabPanel value="1">
                        <DevicesTableForNEVMServer object={object}/>
                    </TabPanel>
                ):(<TabPanel value="1">
                    <DevicesTableForNEDevices object={object}/>
                </TabPanel>)}

                {(object.typeId==9)?(
                    <TabPanel value="2">
                        <VirtualMachineTabForNE object={object}/>
                    </TabPanel>
                ):('')}
                <TabPanel value="3">
                    <PortsTabForNE object={object} />
                </TabPanel>
                {(object.typeId==9)?(
                    <TabPanel value="4">
                        <VirtualPortMappingTabForNE object={object}/>
                    </TabPanel>
                ):('')}
                <TabPanel value="5">
                    <VirtualInterfaceTabForNEs object={object} />
                </TabPanel>
                <TabPanel value="6">
                    Port Mapping
                </TabPanel>
            </TabContext>
        </Box>
    );

}

