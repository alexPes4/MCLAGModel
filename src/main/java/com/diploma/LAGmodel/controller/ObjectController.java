package com.diploma.LAGmodel.controller;

import ch.qos.logback.core.net.SyslogOutputStream;
import com.diploma.LAGmodel.dto.Port;
import com.diploma.LAGmodel.model.ObjectEL;
import jakarta.annotation.Nullable;
import jakarta.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import src.main.java.com.diploma.LAGmodel.service.ObjectService;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/objects")
public class ObjectController {
    @Autowired
    private ObjectService objectService;

    @GetMapping("/getAll")
    public List<ObjectEL> getAllObjects(){
        return objectService.getAllObjects();
    }

    @GetMapping("/get/{objectId}")
    public ObjectEL getObjectById(@PathVariable("objectId") final Long objectId){
        ObjectEL ob = objectService.getObjectById(objectId);
        return ob;
    }
    @GetMapping("/LAGModels")
    public ResponseEntity<List<ObjectEL>> getObjectById(){
        return ResponseEntity.ok(objectService.getLAGModels());
    }

    @GetMapping("/hierarchy/{objectId}")
    public List<Object[]> getHierarchy(@PathVariable("objectId") final Long objectId){
        return objectService.getHierarchyForObject(objectId);
    }
    @GetMapping("/Devices")
    public List<ObjectEL> getDevices(){
        return objectService.getDevices();
    }
    @GetMapping("/portsForDevice")
    public List<ObjectEL> getPortsByDevice(@RequestParam Long deviceId){
        return objectService.getPortsByDevice(deviceId);
    }
    @GetMapping("/portsForDeviceToAssignToVPM")
    public List<ObjectEL> portsForDeviceToAssignToVPM(@RequestParam Long deviceId){
        ObjectEL device = objectService.getObjectById(deviceId);
        List<ObjectEL> interfaces = new ArrayList<>();
        if (device.getTypeId()!=9) interfaces.addAll(objectService.getPortsByDevice(deviceId));
        else interfaces.addAll(objectService.getLAGsForNE(deviceId));
        return interfaces;
    }

    @PostMapping("/createPort")
    public ModelAndView createPort(@RequestParam String name,
                                   @RequestParam String description,
                                   @RequestParam Long deviceId){
        ObjectEL port =new ObjectEL();
        port.setOrder(objectService.getMaxOrderForOrderELByParentAndType(deviceId,8L)+1);
        port.setName(name+"/"+port.getOrder());
        port.setDescription(description);
        port.setTypeId(8L);
        port.setParentId(deviceId);
        port = objectService.createPort(port);
        return new ModelAndView("redirect:http://localhost:3000/"+deviceId);
    }
    @GetMapping("/deletePorts")
    public String deletePorts(@RequestParam Long[] portIds,@RequestParam Long deviceId){
        for (Long portId: portIds) {
            objectService.deletePort(portId);
        }
        return "http://localhost:3000/"+deviceId;
    }
    @GetMapping("/countries")
    public List<ObjectEL> getCountries(){


        return objectService.getCountries();
    }
    @PostMapping("/createCity")
    public ModelAndView createCity(@RequestParam String name,
                                   @RequestParam String description,
                                   @RequestParam Long parentId){
        ObjectEL city =new ObjectEL();
        city.setName(name);
        city.setDescription(description);
        city.setTypeId(14L);
        city.setParentId(parentId);
        city = objectService.createPort(city);
        return new ModelAndView("redirect:http://localhost:3000/"+city.getObjectId());
    }
    @PostMapping("/createCountry")
    public ModelAndView createCountry(@RequestParam String name,
                                   @RequestParam String description,
                                   @RequestParam Long parentId){
        ObjectEL country =new ObjectEL();
        country.setName(name);
        country.setDescription(description);
        country.setTypeId(13L);
        country.setParentId(parentId);
        country = objectService.createPort(country);
        return new ModelAndView("redirect:http://localhost:3000/"+country.getObjectId());
    }
    @PostMapping("/createLocation")
    public ModelAndView createLocation(@RequestParam String name,
                                   @RequestParam String description,
                                   @RequestParam Long parentId){
        ObjectEL loc =new ObjectEL();
        loc.setName(name);
        loc.setDescription(description);
        loc.setTypeId(15L);
        loc.setParentId(parentId);
        loc = objectService.createPort(loc);
        return new ModelAndView("redirect:http://localhost:3000/"+loc.getObjectId());
    }

    @GetMapping("/childLocations")
    public List<ObjectEL> getChildLocations(@RequestParam Long locId,@RequestParam Long typeId){
        return objectService.getChildLocations(locId, typeId);
    }

    @GetMapping("/deleteLocations")
    public String deleteLocations(@RequestParam Long[] locIds,@RequestParam Long parentId){
        for (Long portId: locIds) {
            objectService.deletePort(portId);
        }
        return "http://localhost:3000/"+parentId;
    }

    @GetMapping("/Ports/getPort")
    public Port getPort(@RequestParam Long portId){
        Port port = new Port();
        port.setObjectObj(objectService.getObjectById(portId));
        port.setDeviceObj(objectService.getObjectById(port.getObjectObj().getParentId()));
        port.setLocationObj(objectService.getLocationForObject(portId));
        port.setInterfacesObj(objectService.getLAGForPort(portId));
        port.setVpmsList(objectService.getVPMsForPort(portId));
        if(port.getInterfacesObj()!=null) {
            List<ObjectEL> vpms = new ArrayList<>();
            vpms.addAll(port.getVpmsList());
            vpms.addAll(objectService.getVPMsForPort(port.getInterfacesObj().getObjectId()));
            port.setVpmsList(vpms);
        }
        port.setCircuitObj(objectService.getCircuitForPort(portId));
        return port;
    }
}
