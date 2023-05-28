package com.diploma.LAGmodel.controller;

import com.diploma.LAGmodel.model.ObjectEL;
import com.diploma.LAGmodel.model.Reference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/objects/LAG")
public class VirtualInterfaceController {
    @Autowired
    private src.main.java.com.diploma.LAGmodel.service.ObjectService objectService;

    @GetMapping("/getAssignedPortsForLAG")
    public List<ObjectEL> getAssignedPortsForLAG(@RequestParam Long lagId){
        return objectService.getAssignedPortsForLAG(lagId);
    }

    @PostMapping("/assignPortsToLAG")
    public ModelAndView assignPortsToLAG(@RequestParam Long[] portIds,
                                       @RequestParam Long lagId){
        Reference ref = new Reference();
        ref.setAttrId(9L);
        ref.setObjectId(lagId);
        for (Long portId: portIds
        ) {
            ref.setReferenceId(portId);
            objectService.addReference(ref);
        }
        return new ModelAndView("redirect:http://localhost:3000/"+lagId);
    }

    @GetMapping("/releasePorts")
    public String deleteLocations(@RequestParam Long[] portIds,@RequestParam Long lagId){
        Reference ref= new Reference();
        for (Long portId: portIds) {
            ref.setAttrId(9L);
            ref.setObjectId(lagId);
            ref.setReferenceId(portId);
            objectService.releasePortsFromLAG(ref);
        }
        return "http://localhost:3000/"+lagId;
    }
}
