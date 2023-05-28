import * as React from 'react';
import Box from '@mui/material/Box';
import {useEffect, useState} from "react";
import { useLocation } from "react-router-dom";
import BreadCrumbsTop from "./BreadCrumbsTop";
import DeviceTabs from "../Tabs/DeviceTabs";
import LocationsTabs from "../Tabs/LocationsTabs";
import Button from "@mui/material/Button";
import { useNavigate } from 'react-router';
import VMServerTabs from "../NetworkElements/VMServerTabs";
import MCLAGmodel from "../MCLAGModel/MCLAGmodel";
import VirtualInterface from "./VirtualInterafce";
import PathElement from "./PathElement";
import EthernetLink from "../EthernetLinks/EthernetLink";
import VirtualPortMapping from "./VirtualPortMapping";
import Port from "./Port";


export default function Object() {

    const navigate = useNavigate();
        let objectId = window.location.href.split("/")[3];


        const [object, setObject] = useState([]);
        useEffect(() => {
                if (objectId==1) navigate('/');
                fetch("http://localhost:8080/objects/get/" + (objectId ? objectId : 1))
                    .then(res => res.json())
                    .then((result) => {
                        setObject(result);
                    })
            }, []
        )
        return (
            <Box sx={{width: '100%', typography: 'body1'}} style={{textAlign: "left"}}>
                <BreadCrumbsTop objectId={objectId}/>
                <Button href={'/'+objectId}>{object.name}</Button>
                {console.log("Type Id:"+object.typeId)}
                {object.typeId==12?(
                <DeviceTabs objectId={objectId}/>
            ):(<></>)}
                {object.typeId==11?(
                    <DeviceTabs objectId={objectId}/>
                ):(<></>)}
                {(object.typeId==13||object.typeId==14||object.typeId==15)?(
                    <LocationsTabs object={object}/>
                ):(<></>)}
                {((object.typeId==9)||(object.typeId==22))?(
                    <VMServerTabs object={object}/>
                ):(<></>)}
                {object.typeId==10?(
                    <DeviceTabs objectId={objectId}/>
                ):(<></>)}
                {object.typeId==2?(
                    <MCLAGmodel object={object}/>
                ):(<></>)}
                {object.typeId==7?(
                    <VirtualInterface object={object}/>
                ):(<></>)}
                {(object.typeId==3||object.typeId==4||object.typeId==5)?(
                    <PathElement object={object}/>
                ):(<></>)}
                {object.typeId==6?(
                    <EthernetLink object={object}/>
                ):(<></>)}
                {object.typeId==23?(
                    <VirtualPortMapping object={object}/>
                ):(<></>)}
                {object.typeId==8?(
                    <Port object={object}/>
                ):(<></>)}
            </Box>
        );

}