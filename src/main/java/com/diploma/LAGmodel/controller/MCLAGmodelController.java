package com.diploma.LAGmodel.controller;

import com.diploma.LAGmodel.dto.MCLAGModel;
import com.diploma.LAGmodel.dto.PathElement;
import com.diploma.LAGmodel.model.ObjectEL;
import com.diploma.LAGmodel.model.Reference;
import com.diploma.LAGmodel.model.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/objects/MCLAG")
public class MCLAGmodelController {
    @Autowired
    private src.main.java.com.diploma.LAGmodel.service.ObjectService objectService;
    @PostMapping("/createMCLAG")
    public ModelAndView createEP(@RequestParam Long Location3,
                                 @RequestParam Long Location4,
                                 @RequestParam String name,
                                 @RequestParam String description){

        ObjectEL mcLag = new ObjectEL();
        mcLag.setTypeId(2L);
        mcLag.setParentId(1L);
        mcLag.setOrder(objectService.getMaxOrderForOrderELByParentAndType(1L,2L)+1);
        ObjectEL loc3 = objectService.getObjectById(Location3);
        ObjectEL loc4 = objectService.getObjectById(Location4);
        mcLag.setName(loc3.getName()+"-"+loc4.getName()+" "+name+" "+mcLag.getOrder());
        mcLag.setDescription(description);
        mcLag = objectService.createMCLAGmodel(mcLag);
        Reference refLoc = new Reference();
        refLoc.setObjectId(mcLag.getObjectId());
        refLoc.setAttrId(10L);
        refLoc.setReferenceId(Location3);
        objectService.addReference(refLoc);
        refLoc = new Reference();
        refLoc.setObjectId(mcLag.getObjectId());
        refLoc.setAttrId(11L);
        refLoc.setReferenceId(Location4);
        objectService.addReference(refLoc);
        objectService.addValueForObject(16L,mcLag.getObjectId(),"In Planned");
        return new ModelAndView("redirect:http://localhost:3000/"+mcLag.getObjectId());

    }
    @GetMapping("/getMCLAGModel")
    public MCLAGModel getMCLAGModel(@RequestParam Long mclagId){
        MCLAGModel mclagmodel = new MCLAGModel();
        mclagmodel.setObject(objectService.getObjectById(mclagId));
        mclagmodel.setLocA(objectService.getObjectById(objectService.getReference(10L,mclagId).getReferenceId()));
        mclagmodel.setLocZ(objectService.getObjectById(objectService.getReference(11L,mclagId).getReferenceId()));
        mclagmodel.setEndPoints(objectService.getEndPointsForMCLAG(mclagId));
        mclagmodel.setPathElements(objectService.getPathElementsForMCLAG(mclagId));
        if (mclagmodel.getObject().getTypeId().equals(2L)){
            mclagmodel.setStatus(objectService.getValueByAttrIdAndObjectId(16L,mclagId).getValue());
        }
        return mclagmodel;
    }

    @GetMapping("/getAvailableEthernetLinksForModel")
    public List<ObjectEL> getMCLAGModel(@RequestParam Long[] locId){
        return objectService.getAvailableEthernetLinksForModel(locId);
    }

    @PostMapping("/createPathElement")
    public ModelAndView createPathElement(@RequestParam(required = false) Long EthernetLink5,
                                 @RequestParam Long mclagId){

        ObjectEL pathElement = new ObjectEL();
        pathElement.setTypeId(5L);
        pathElement.setParentId(mclagId);
        pathElement.setOrder(objectService.getMaxOrderForOrderELByParentAndType(mclagId,5L)+1);
        pathElement.setName("Path Element "+pathElement.getOrder());
        pathElement = objectService.createPathElement(pathElement);
        Reference ref = new Reference();
        if (EthernetLink5!=null){
            ref.setAttrId(3L);
            ref.setObjectId(pathElement.getObjectId());
            ref.setReferenceId(EthernetLink5);
            objectService.addReference(ref);
        }
        return new ModelAndView("redirect:http://localhost:3000/"+mclagId);

    }

    @GetMapping("/deleteMCLAGModels")
    public String deleteMCLAGModels(@RequestParam Long[] mclagIds,
                                            @RequestParam Long riId){
        //delete path elements

        //delete endpoints
        for (Long mclagId: mclagIds
             ) {
            List<PathElement> pathElements = new ArrayList<>();
            pathElements.addAll(objectService.getEndPointsForMCLAG(mclagId));
            pathElements.addAll(objectService.getPathElementsForMCLAG(mclagId));
            List<Long> peIds = new ArrayList<>();
            for (PathElement pe: pathElements
                 ) {
                peIds.add(pe.getObject().getObjectId());
            }
            if (!peIds.isEmpty()) objectService.deletePathElements(peIds);
            objectService.deleteAllReferencesByObjectId(mclagId);
            objectService.deleteAllValuesByObjectId(mclagId);
            objectService.deleteObjectELByObjectId(mclagId);
        }
        //delete location
        //delete mclag
        return "http://localhost:3000/";
    }

    @GetMapping("/changeStatus")
    public String changeStatus(@RequestParam Long mclagId,
                                    @RequestParam String status){
        Value statusValue = objectService.getValueByAttrIdAndObjectId(16L, mclagId);
        objectService.deleteValue(statusValue);
        statusValue.setValue(status);
        objectService.saveValue(statusValue);
        return "http://localhost:3000/"+mclagId;
    }

}
