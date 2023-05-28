import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import {Input} from "@mui/material";

function sleep(delay = 0) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}
function getRowsForListItems(result) {
    let data=[]
    for(let i=0;i<result.length;i++){
        console.log(result[i].objectId+"|"+result[i].name);
        data.push({ id: result[i].objectId, label: result[i].name})
    }
    return data;
}
async function showAllCountries() {
    let data=[];
    await fetch("http://localhost:8080/objects/countries")
        .then(res=>res.json())
        .then((result) => {
            data= getRowsForListItems(result);
        });

    listItems=data;
}
async function showAllCities(typeEP) {
    let data=[];
    let locId=document.getElementsByName('Country'+typeEP)[0].value;
    console.log("Country value:"+locId);
    await fetch("http://localhost:8080/objects/childLocations?locId="+locId+"&typeId=14")
        .then(res=>res.json())
        .then((result) => {
            data= getRowsForListItems(result);
        });

    listItems=data;
}
async function showLocationsForCity(typeEP) {
    let data=[];
    let locId=document.getElementsByName('City'+typeEP)[0].value;
    console.log("locId:"+locId);
    await fetch("http://localhost:8080/objects/childLocations?locId="+locId+"&typeId=15")
        .then(res=>res.json())
        .then((result) => {
            data= getRowsForListItems(result);
        });

    listItems=data;
}


async function showAllCarriersForA() {
    let data=[];
    let locId=document.getElementsByName('Location3')[0].getAttribute('value');
    console.log("locId:"+locId);
    await fetch("http://localhost:8080/objects/NE/allForLocation?locId="+locId)
        .then(res=>res.json())
        .then((result) => {
            console.log("result:"+data)
            data= getRowsForListItems(result);
        });

    console.log("data:"+data)
    listItems=data;
}
async function showAllCarriersForZ() {
    let data=[];
    let locId=document.getElementsByName('Location4')[0].getAttribute('value');
    console.log("locId:"+locId);
    await fetch("http://localhost:8080/objects/NE/allForLocation?locId="+locId)
        .then(res=>res.json())
        .then((result) => {
            data= getRowsForListItems(result);
        });

    listItems=data;
}
async function showAllAvailableEthernetLinksForModel() {
    let data=[];
    let locIdA=document.getElementsByName('Location3')[0].getAttribute('value');
    let locIdZ=document.getElementsByName('Location4')[0].getAttribute('value');
    await fetch("http://localhost:8080/objects/MCLAG/getAvailableEthernetLinksForModel?locId="+locIdA+"&locId="+locIdZ)
        .then(res=>res.json())
        .then((result) => {
            data= getRowsForListItems(result);
        });

    listItems=data;
}

async function showAllDevicesForVirtualPortMapping(neId) {
    let data=[];
    await fetch("http://localhost:8080/objects/NE/getAssignDeviceOnNE?neId="+neId)
        .then(res=>res.json())
        .then((result) => {
            data= getRowsForListItems(result);
        });

    listItems=data;
}

async function showAllVMForVirtualPortMapping(neId) {
    let data=[];
    await fetch("http://localhost:8080/objects/NE/getVMsForNE?neId="+neId)
        .then(res=>res.json())
        .then((result) => {
            data= getRowsForListItems(result);
        });

    listItems=data;
}

async function showAllPortsOfDeviceForVirtualPortMapping(elementName) {
    let data=[];

    let deviceId=document.getElementsByName(elementName)[0].getAttribute('value');
    console.log("deviceId:"+deviceId);
    await fetch("http://localhost:8080/objects/portsForDeviceToAssignToVPM?deviceId="+deviceId)
        .then(res=>res.json())
        .then((result) => {
            data= getRowsForListItems(result);
        });

    listItems=data;
}
async function showAllCarriersForEP(mclagId, typeEP) {
    let data=[];
    let locObj=[];
    await fetch("http://localhost:8080/objects/NE/getLocationByMCLAGId?mclagId="+mclagId+"&typeEP="+typeEP)
        .then(res=>res.json())
        .then((result) => {
            console.log(result);
            locObj= result;
        });
    await fetch("http://localhost:8080/objects/NE/allForLocation?locId="+locObj.objectId)
        .then(res=>res.json())
        .then((result) => {
            data= getRowsForListItems(result);
        });

    listItems=data;
}
async function showAvailableResourcesForEP(carrierId) {
    let data=[];
    console.log(carrierId);
    await fetch("http://localhost:8080/objects/endPoints/getAvailableResourcesForEPA?carrierId="+carrierId)
        .then(res=>res.json())
        .then((result) => {
            console.log("Resources for EP:")
            console.log(result)
            data= getRowsForListItems(result);
        });
    if (data==[]) {
        data.push({id:0})
    }
    listItems=data;
}

async function showAvailableResourcesForEPofEthernetLink(typeEP) {
    let data=[];
    let carrierId=document.getElementsByName('Carrier'+typeEP)[0].getAttribute('value');
    await fetch("http://localhost:8080/objects/EthernetLinks/getAvailableResourcesForEPA?carrierId="+carrierId)
        .then(res=>res.json())
        .then((result) => {
            console.log(result)
            data= getRowsForListItems(result);
        });
    if (data==[]) {
        data.push({id:0})
    }
    listItems=data;
}

async function showAllAvailableResources(typeEP) {
    let data=[];
    let carrierId=document.getElementsByName('Carrier'+typeEP)[0].getAttribute('value');
    console.log("carrierId:"+carrierId);
    await fetch("http://localhost:8080/objects/endPoints/getAvailableResourcesForCarrier?carrierId="+carrierId)
        .then(res=>res.json())
        .then((result) => {
            data= getRowsForListItems(result);
        });

    listItems=data;
}


export default function AsynchronousSelect(props) {
    const typeEP=(props.typeId==null?'':props.typeId);
    const label = props.label;
    const [open, setOpen] = React.useState(false);


    const [options, setOptions] = React.useState([]);
    let loading = open && options.length === 0;
    React.useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            if(label=='Country')
            await showAllCountries(typeEP);
            else if(label=='City')
                await showAllCities(typeEP);
            else if(label=='Location')
                await showLocationsForCity(typeEP)
            else if(label=='Carrier'){
                if (typeEP==3)
                    await showAllCarriersForA()
                else await showAllCarriersForZ()
            }
            else if(label=='Resource'){
                if (props.ethernetLink==null){
                    await showAllAvailableResources(typeEP);
                }
                else await showAvailableResourcesForEPofEthernetLink(typeEP);
            }
            else if (label.replaceAll(' ','')=='CarrierForEP'){
                console.log("invoke show method")
                await showAllCarriersForEP(props.mclagId,typeEP);
            }
            else if (label.replaceAll(' ','')=='ResourceForEP')
            {
                await showAvailableResourcesForEP(props.carrierId);
            }
            else if (label.replaceAll(' ','')=='ResourceForEthernetLink')
            {
                await showAvailableResourcesForEPofEthernetLink(typeEP);
            }
            else if (label.replaceAll(' ','')=='EthernetLink')
            {
                await showAllAvailableEthernetLinksForModel();
            }
            else if (label.replaceAll(' ','')=='VMServer')
            {
                await showAllDevicesForVirtualPortMapping(props.neId);
            }
            else if (label.replaceAll(' ','')=='VirtualMachine')
            {
                await showAllVMForVirtualPortMapping(props.neId);
            }
            else if (label.replaceAll(' ','')=='PortofVMServer')
            {
                await showAllPortsOfDeviceForVirtualPortMapping('VMServer');
            }
            else if (label.replaceAll(' ','')=='PortofVirtualMachine')
            {
                await showAllPortsOfDeviceForVirtualPortMapping('VirtualMachine');
            }


            if (active) {
                setOptions([...listItems]);
            }

            if (listItems.length<1){
                loading = false;
            }
            console.log("after request listItems= "+listItems.length);
        })();

        return () => {
            active = false;
        };
    }, [loading]);

    React.useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);
    const [value, setValue] = React.useState(null);
    return (
        <Autocomplete
            id="controllable-states-demo"
            sx={{ width: 300 }}
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            onChange={(event, newValue) => {
                console.log("newValue(1):"+newValue);
                setValue(newValue);
            }}
            getOptionLabel={(option) => option.label}
            id="controllable-states-demo"
            options={options}
            loading={loading}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
                <div><TextField
                    {...params}
                    label={label}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}

                            </React.Fragment>
                        ),
                    }}
                />
                    <Input  name={label.replaceAll(' ','')+typeEP} type="hidden"  margin="dense"  value={value==undefined?null:value.id}  id="outlined-basic" />
                </div>

            )}

            style={{marginTop: 20, width: '100%' }}
        />
    );
}

// Top films as rated by IMDb users. http://www.imdb.com/chart/top
let listItems = [];