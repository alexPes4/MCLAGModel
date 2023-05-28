package com.diploma.LAGmodel.controller;

import com.diploma.LAGmodel.dto.VirtualPortMapping;
import com.diploma.LAGmodel.model.ObjectEL;
import com.diploma.LAGmodel.model.Reference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/objects/NE")
public class NetworkElementController {
    @Autowired
    private src.main.java.com.diploma.LAGmodel.service.ObjectService objectService;
    @PostMapping("/createNewNE")
    public ModelAndView createDevice(@RequestParam String name,
                                     @RequestParam String description,
                                     @RequestParam Long typeId,
                                     @RequestParam Long parentId){
        ObjectEL netEl =new ObjectEL();
        netEl.setOrder(objectService.getMaxOrderForOrderELByParentAndType(parentId,typeId)+1);
        ObjectEL loc = objectService.getObjectById(parentId);
        String pref = typeId==9?"VM Server ":"";
        netEl.setName(pref+loc.getName()+" "+name);
        netEl.setDescription(description);
        netEl.setTypeId(typeId);
        netEl.setParentId(parentId);
        netEl.setClassId(17L);
        netEl = objectService.createPort(netEl);
        return new ModelAndView("redirect:http://localhost:3000/"+netEl.getObjectId());

    }
    @GetMapping("/allForLocation")
    public List<ObjectEL> getAllNEsForLoc(@RequestParam Long locId){
        return objectService.getAllNEsForLoc(locId);
    }

    @GetMapping("/deleteNEs")
    public String deleteDevices(@RequestParam Long[] neIds,@RequestParam Long parentId){
        for (Long neId: neIds) {
            List<VirtualPortMapping> vpms = getVirtualPortMappings(neId);
            if (!vpms.isEmpty()){
                List<Long> vpmIds = new ArrayList<>();
                for (VirtualPortMapping vpm:vpms
                     ) {
                    vpmIds.add(vpm.getObject().getObjectId());
                }
                objectService.deleteVPMs(vpmIds.toArray(new Long[vpmIds.size()]));
            }
            List<ObjectEL> vms = getVMsForNE(neId);
            if(!vms.isEmpty()){
                List<Long> vmIds = new ArrayList<>();
                for (ObjectEL vm:vms
                ) {
                    vmIds.add(vm.getObjectId());
                }
                objectService.deleteVMs(vmIds.toArray(new Long[vmIds.size()]));
            }
            List<ObjectEL> virtInts = getLAGsForNE(neId);
            if (!virtInts.isEmpty()){
                List<Long> virtIntIds = new ArrayList<>();
                for(ObjectEL viId: virtInts){
                    virtIntIds.add(viId.getObjectId());
                }
                objectService.deleteLAGs(virtIntIds.toArray(new Long[virtIntIds.size()]));
            }
        }
        objectService.deleteNEs(neIds);
        return "http://localhost:3000/"+parentId;
    }
    @GetMapping("/getDevicesToAssign")
    public List<ObjectEL> getDevicesToAssignToNE(@RequestParam Long locId){
        return objectService.getDevicesToAssignToNE(locId);
    }

    @GetMapping("/getCardsToAssignOnVMServer")
    public List<ObjectEL> getCardsToAssignOnVMServer(@RequestParam Long locId){

        return objectService.getCardsToAssignOnVMServer(locId);
    }

    @GetMapping("/getDevicesToAssignOnVMServer")
    public List<ObjectEL> getDevicesToAssignOnVMServer(@RequestParam Long locId){

        return objectService.getDevicesToAssignOnVMServer(locId);
    }

    @GetMapping("/getSharedDevicesToAssignOnVMServer")
    public List<ObjectEL> getSharedDevicesToAssignOnVMServer(@RequestParam Long locId){

        return objectService.getSharedDevicesToAssignOnVMServer(locId);
    }

    @GetMapping("/getAssignDevicesOnNEVMServer")
    public List<ObjectEL> getAssignDevicesOnNEVMServer(@RequestParam Long neId){
        return objectService.getAssignDevicesOnNEVMServer(neId);
    }

    @GetMapping("/getAssignSharedDevicesOnNEVMServer")
    public List<ObjectEL> getAssignSharedDevicesOnNEVMServer(@RequestParam Long neId){
        return objectService.getAssignSharedDevicesOnNEVMServer(neId);
    }

    @GetMapping("/getAssignCardsOnNEVMServer")
    public List<ObjectEL> getAssignCardsOnNEVMServer(@RequestParam Long neId){
        return objectService.getAssignCardsOnNEVMServer(neId);
    }

    @GetMapping("/getAssignDeviceOnNE")
    public List<ObjectEL> getAssignDeviceOnNE(@RequestParam Long neId){
        List<ObjectEL> devices = objectService.getAssignDeviceOnNE(neId);
        devices.add(objectService.getObjectById(neId));
        return devices;
    }



    @PostMapping("/assigneDevicesToNE")
    public ModelAndView assignDevicesToNE(@RequestParam Long[] devIds,@RequestParam Long neId){
        Reference ref= new Reference();
        for (Long devId: devIds
             ) {
            ref.setAttrId(8L);
            ref.setObjectId(neId);
            ref.setReferenceId(devId);
            objectService.assignDevicesToNE(ref);
        }
        return new ModelAndView("redirect:http://localhost:3000/"+neId);

    }
    @GetMapping("/releaseDevicesFromNe")
    public String deleteLocations(@RequestParam Long[] devIds,@RequestParam Long neId){
        Reference ref= new Reference();
        for (Long devId: devIds) {
            ref.setAttrId(8L);
            ref.setObjectId(neId);
            ref.setReferenceId(devId);
            objectService.releaseDevicesFromNE(ref);
        }
        return "http://localhost:3000/"+neId;
    }

    @GetMapping("/getPortsForNE")
    public List<ObjectEL> getPortsForNE(@RequestParam Long neId){
        List<ObjectEL> devices = objectService.getAssignDeviceOnNE(neId);
        List<ObjectEL> ports = new ArrayList<>();
        for (ObjectEL dev:devices
             ) {
            ports.addAll(objectService.getPortsByDevice(dev.getObjectId()));
        }

        return ports;
    }
    @GetMapping("/getPortsToAssignOnVI")
    public List<ObjectEL> getPortsToAssignOnVI(@RequestParam Long neId){
        return objectService.getPortsToVIAssign(neId);
    }
    @PostMapping("/createNewVI")
    public ModelAndView createNewVI(@RequestParam String name, @RequestParam String description,
                                               @RequestParam Long[] portIds, @RequestParam Long locId,
                                               @RequestParam Long neId){
        ObjectEL virtInter = new ObjectEL();
        virtInter.setOrder(objectService.getMaxOrderForOrderELByParentAndType(neId,7L)+1);
        virtInter.setName(name+virtInter.getOrder());
        virtInter.setDescription(description);
        virtInter.setParentId(neId);
        virtInter.setTypeId(7L);
        ObjectEL lag = objectService.createLAG(virtInter);
        Reference ref = new Reference();
        ref.setAttrId(9L);
        ref.setObjectId(lag.getObjectId());
        for (Long portId: portIds
             ) {
            ref.setReferenceId(portId);
            objectService.addReference(ref);
        }
        return new ModelAndView("redirect:http://localhost:3000/"+lag.getObjectId());
    }
    @GetMapping("/getLAGsForNE")
    public List<ObjectEL> getLAGsForNE(@RequestParam Long neId){
        return objectService.getLAGsForNE(neId);
    }

    @PostMapping("/createNewVM")
    public ModelAndView createNewVM(@RequestParam String name,
                                     @RequestParam String description,
                                    @RequestParam Long neId){
        ObjectEL vmEL =new ObjectEL();
        vmEL.setOrder(objectService.getMaxOrderForOrderELByParentAndType(neId,10L)+1);
        vmEL.setName(name+" "+vmEL.getOrder());
        vmEL.setDescription(description);
        vmEL.setTypeId(10L);
        vmEL.setParentId(neId);
        vmEL = objectService.createPort(vmEL);
        return new ModelAndView("redirect:http://localhost:3000/"+vmEL.getObjectId());

    }

    @GetMapping("/getVMsForNE")
    public List<ObjectEL> getVMsForNE(@RequestParam Long neId){
        return objectService.getVMsForNE(neId);
    }

    @GetMapping("/deleteVMs")
    public String deleteVMs(@RequestParam Long[] vmIds,@RequestParam Long neId){
        objectService.deleteVMs(vmIds);
        return "http://localhost:3000/"+neId;
    }
    @GetMapping("/deleteVPMs")
    public String deleteVPMs(@RequestParam Long[] vpmIds,@RequestParam Long neId){
        objectService.deleteVPMs(vpmIds);
        return "http://localhost:3000/"+neId;
    }
    @GetMapping("/deleteLAGs")
    public String deleteLAGs(@RequestParam Long[] virtIntIds,@RequestParam Long neId){
        objectService.deleteLAGs(virtIntIds);
        return "http://localhost:3000/"+neId;
    }
    @GetMapping("/getLocationByMCLAGId")
    public ObjectEL getLocationByMCLAGId(@RequestParam Long mclagId, @RequestParam Long typeEP){
        return objectService.getLocationForMCLAGModel(mclagId, typeEP);
    }

    @GetMapping("/getVirtualPortMappings")
    public List<VirtualPortMapping> getVirtualPortMappings(@RequestParam Long neId){
        List<ObjectEL> objects = objectService.getObjectByParentIdAndTypeId(neId, 23L);
        List<VirtualPortMapping> virtualPortMappings = new ArrayList<>();
        for (ObjectEL ob:objects
             ) {
            VirtualPortMapping vpm = new VirtualPortMapping();
            vpm.setObject(ob);
            Reference portOfVMServer = objectService.getReference(14L,ob.getObjectId());
            if (portOfVMServer != null ) {
                vpm.setPortOfVMServer(objectService.getObjectById(portOfVMServer.getReferenceId()));
                vpm.setVMServer(objectService.getParentByObjectId(vpm.getPortOfVMServer().getObjectId()));
            }
            Reference portOfVirtualMachine = objectService.getReference(15L, ob.getObjectId());
            if (portOfVirtualMachine != null ) {
                vpm.setPortOfVirtualMachine(objectService.getObjectById(portOfVirtualMachine.getReferenceId()));
                vpm.setVirtualMachine(objectService.getParentByObjectId(vpm.getPortOfVirtualMachine().getObjectId()));
            }
            virtualPortMappings.add(vpm);
        }
        return virtualPortMappings;
    }

    @PostMapping("/createNewVirtualPortMappings")
    public ModelAndView createNewVirtualPortMappings(@RequestParam Long neId,
                                                    @RequestParam Long PortofVMServer,
                                                    @RequestParam Long PortofVirtualMachine){
        ObjectEL virtPM =new ObjectEL();
        virtPM.setTypeId(23L);
        virtPM.setParentId(neId);
        virtPM.setOrder(objectService.getMaxOrderForOrderELByParentAndType(neId,23L)+1);
        virtPM.setName("Virtual Port Mapping "+virtPM.getOrder());
        virtPM = objectService.createVirtPM(virtPM);
        Reference portOfNEs = new Reference();
        portOfNEs.setAttrId(14L);
        portOfNEs.setObjectId(virtPM.getObjectId());
        portOfNEs.setReferenceId(PortofVMServer);
        objectService.addReference(portOfNEs);
        Reference portOfVM = new Reference();
        portOfVM.setAttrId(15L);
        portOfVM.setObjectId(virtPM.getObjectId());
        portOfVM.setReferenceId(PortofVirtualMachine);
        objectService.addReference(portOfVM);
        return new ModelAndView("redirect:http://localhost:3000/"+virtPM.getObjectId());

    }

    @GetMapping("/getVirtualPortMapping")
    public VirtualPortMapping getVirtualPortMapping(@RequestParam Long vpmId){
        ObjectEL object = objectService.getObjectById(vpmId);
        VirtualPortMapping vpm = new VirtualPortMapping();
        vpm.setObject(object);
        Reference portOfVMServer = objectService.getReference(14L,object.getObjectId());
        if (portOfVMServer != null) {
            vpm.setPortOfVMServer(objectService.getObjectById(portOfVMServer.getReferenceId()));
            vpm.setVMServer(objectService.getParentByObjectId(vpm.getPortOfVMServer().getObjectId()));
        }
        Reference portOfVirtualMachine = objectService.getReference(15L, object.getObjectId());
        if (portOfVirtualMachine != null) {
            vpm.setPortOfVirtualMachine(objectService.getObjectById(portOfVirtualMachine.getReferenceId()));
            vpm.setVirtualMachine(objectService.getParentByObjectId(vpm.getPortOfVirtualMachine().getObjectId()));
        }
        return vpm;
    }
}
