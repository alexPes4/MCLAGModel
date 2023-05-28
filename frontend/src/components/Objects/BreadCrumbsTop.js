import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import {useEffect, useState} from "react";
import {render} from "react-dom";
import { useParams } from 'react-router-dom'
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor =
        theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[800];
    return {
        backgroundColor,
        height: theme.spacing(3),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
            backgroundColor: emphasize(backgroundColor, 0.06),
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12),
        },
    };
});
function handleClick(event) {
    //event.preventDefault();
    //console.info('You clicked a breadcrumb.');
    //console.log(event.getAttribute("href"));
}

export default function BreadCrumbsTop(props) {
        const[object, setObject]=useState([]);
        const[hierarchy, setHierarchy]=useState([]);
        let objectId = props.objectId;
        useEffect(()=>{
                fetch("http://localhost:8080/objects/get/"+(objectId?objectId:1))
                    .then(res=>res.json())
                    .then((result)=>{
                        setObject(result);
                    })
            },[]
        )
        useEffect(()=>{
                fetch("http://localhost:8080/objects/hierarchy/"+(objectId?objectId:1))
                    .then(res=>res.json())
                    .then((result)=>{
                        console.log(result);
                        setHierarchy(result);
                    })
            },[]
        )
        return (
            <div role="presentation" onClick={handleClick} style={{marginTop:5, marginBottom:10}}>
                <Breadcrumbs aria-label="breadcrumb">
                    {hierarchy.map((hierarch)=>(
                        hierarch[0]==1?
                        <StyledBreadcrumb component="a"   href= {`/${hierarch[0]}`} label= {`${hierarch[1]}`} icon={<HomeIcon fontSize="small" />} />
                        : hierarch[0]==objectId?<StyledBreadcrumb component="a"   href= {`/${hierarch[0]}`} label= {`${hierarch[1]}`}  deleteIcon={<ExpandMoreIcon />} onDelete={handleClick}/>
                        :<StyledBreadcrumb component="a"   href= {`/${hierarch[0]}`} label= {`${hierarch[1]}`} />
                    ))}
                </Breadcrumbs>
            </div>
        );
}