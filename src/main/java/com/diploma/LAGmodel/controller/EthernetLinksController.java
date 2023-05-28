package com.diploma.LAGmodel.controller;

import com.diploma.LAGmodel.dto.MCLAGModel;
import com.diploma.LAGmodel.dto.PathElement;
import com.diploma.LAGmodel.model.ObjectEL;
import com.diploma.LAGmodel.model.Reference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/objects/EthernetLinks")
public class EthernetLinksController {
    @Autowired
    private src.main.java.com.diploma.LAGmodel.service.ObjectService objectService;
    @GetMapping("/getAll")
    public List<ObjectEL> getAllEthernetLinks(){
        return objectService.getAllEthernetLinks();
    }
    @GetMapping("/getAvailableResourcesForEPA")
    public List<ObjectEL> getAvailableResourcesForEPA(@RequestParam Long carrierId){
        return objectService.getAvailableResourcesForCarrierOfEthernetLink(carrierId);
    }
    @GetMapping("/getAvailableResourcesForEPZ")
    public List<ObjectEL> getAvailableResourcesForEPZ(@RequestParam Long carrierId){
        return objectService.getAvailableResourcesForCarrierOfEthernetLink(carrierId);
    }
    @GetMapping("/getEndPoint")
    public List<ObjectEL> getEndPoint(@RequestParam Long ethLink, @RequestParam Long typeEP){
        return objectService.getObjectByParentIdAndTypeId(ethLink, typeEP);
    }
    @PostMapping("/createEthernetLink")
    public ModelAndView createEP(@RequestParam Long Location3,
                                 @RequestParam Long Location4,
                                 @RequestParam String name,
                                 @RequestParam String description){

        ObjectEL ethLink = new ObjectEL();
        ethLink.setTypeId(6L);
        ethLink.setParentId(1L);
        ethLink.setOrder(objectService.getMaxOrderForOrderELByParentAndType(1L,6L)+1);

        ethLink.setDescription(description);
        ObjectEL loc3 = objectService.getObjectById(Location3);
        ObjectEL loc4 = objectService.getObjectById(Location4);
        ethLink.setName(loc3.getName()+"-"+loc4.getName()+" "+name+" "+ethLink.getOrder());

        ethLink = objectService.createMCLAGmodel(ethLink);
        Reference refLoc = new Reference();
        refLoc.setObjectId(ethLink.getObjectId());
        refLoc.setAttrId(10L);
        refLoc.setReferenceId(Location3);
        objectService.addReference(refLoc);
        refLoc.setAttrId(11L);
        refLoc.setReferenceId(Location4);
        objectService.addReference(refLoc);
        return new ModelAndView("redirect:http://localhost:3000/"+ethLink.getObjectId());

    }

    @GetMapping("/deleteEthernetLinks")
    public String deleteEthernetLinks(@RequestParam Long[] ethLinksIds,
                                    @RequestParam Long riId){
        for (Long ethLinkId: ethLinksIds
        ) {
            List<PathElement> pathElements = new ArrayList<>();
            pathElements.addAll(objectService.getEndPointsForMCLAG(ethLinkId));
            List<Long> peIds = new ArrayList<>();
            for (PathElement pe: pathElements
            ) {
                peIds.add(pe.getObject().getObjectId());
            }
            if (!peIds.isEmpty()) objectService.deletePathElements(peIds);
            objectService.deleteAllReferencesByObjectId(ethLinkId);
            objectService.deleteObjectELByObjectId(ethLinkId);
        }
        return "http://localhost:3000/";
    }
}
