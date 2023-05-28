import * as React from 'react';
import {useEffect, useState} from 'react';
import {DataGrid} from "@mui/x-data-grid";
import Link from "@mui/material/Link";


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
    { field: 'name', headerName: 'Name', width: 130, renderCell: (params) => (
            <Link href={`/${params.row.id}`}>{params.value}</Link>
        ) },
    { field: 'description', headerName: 'Description', width: 330 }
];
export default function PortsTabForNE(props) {
    const objectNE=props.object;
    const neId=objectNE.objectId;
    const [rows, setRow] = useState([]);
    useEffect(  ()=>  {
            fetch("http://localhost:8080/objects/NE/getPortsForNE?neId="+neId)
                .then(res=>res.json())
                .then((ports) => {
                    setRow(setRows(ports));
                });
        }, []
    );
    return (
        <div style={{width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
            />
        </div>
    );

}
