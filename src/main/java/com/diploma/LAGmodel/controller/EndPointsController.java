package com.diploma.LAGmodel.controller;

import com.diploma.LAGmodel.dto.PathElement;
import com.diploma.LAGmodel.model.ObjectEL;
import com.diploma.LAGmodel.model.Reference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/objects/endPoints")
public class EndPointsController {
    @Autowired
    private src.main.java.com.diploma.LAGmodel.service.ObjectService objectService;

    @PostMapping("/createEPA")
    public ModelAndView createEPA(@RequestParam Long mcLag,@RequestParam Long Carrier3,@RequestParam Long Resource3){
        ObjectEL endPointA = new ObjectEL();
        endPointA.setTypeId(3L);
        endPointA.setName("End Point A");
        endPointA.setParentId(mcLag);
        endPointA = objectService.createPathElement(endPointA);
        Reference ref = new Reference();
        ref.setObjectId(endPointA.getObjectId());
        ref.setAttrId(3L);
        ref.setReferenceId(Carrier3);
        objectService.addReference(ref);
        ref = new Reference();
        ref.setObjectId(endPointA.getObjectId());
        ref.setAttrId(4L);
        ref.setReferenceId(Resource3);
        objectService.addReference(ref);
        return new ModelAndView("redirect:http://localhost:3000/"+mcLag);

    }

    @PostMapping("/createEPZ")
    public ModelAndView createEPZ(@RequestParam Long mcLag,@RequestParam Long Carrier4,@RequestParam Long Resource4){
        ObjectEL endPointA = new ObjectEL();
        endPointA.setTypeId(4L);
        endPointA.setName("End Point Z");
        endPointA.setParentId(mcLag);
        endPointA = objectService.createPathElement(endPointA);
        Reference ref = new Reference();
        ref.setObjectId(endPointA.getObjectId());
        ref.setAttrId(3L);
        ref.setReferenceId(Carrier4);
        objectService.addReference(ref);
        ref = new Reference();
        ref.setObjectId(endPointA.getObjectId());
        ref.setAttrId(4L);
        ref.setReferenceId(Resource4);
        objectService.addReference(ref);
        return new ModelAndView("redirect:http://localhost:3000/"+mcLag);

    }
    @GetMapping("/getAvailableResourcesForCarrier")
    public List<ObjectEL> getAvailableResources(@RequestParam Long carrierId){
        return objectService.getAvailableResourcesForCarrier(carrierId);
    }
    @GetMapping("/deleteEPs")
    public String deleteEndPoints(@RequestParam Long[] epIds,@RequestParam Long mclagId){
        objectService.deletePathElements(Arrays.asList(epIds));
        return "http://localhost:3000/"+mclagId;
    }
    @GetMapping("/deletePEs")
    public String deletePathElements(@RequestParam Long[] peIds,@RequestParam Long mclagId){
        objectService.deletePathElements(Arrays.asList(peIds));
        return "http://localhost:3000/"+mclagId;
    }

    @GetMapping("/getObject")
    public PathElement getObject(@RequestParam Long peId){
        Reference carrier = objectService.getReference(3L, peId);
        Reference resource = objectService.getReference(4L, peId);
        PathElement pathElement = new PathElement();
        pathElement.setObject(objectService.getObjectById(peId));
        if(carrier!=null)
            pathElement.setCarrier(objectService.getObjectById(carrier.getReferenceId()));
        if(resource!=null)
            pathElement.setResource(objectService.getObjectById(resource.getReferenceId()));
        return pathElement;
    }

    @PostMapping("/selectNewCarrierForEPA")
    public ModelAndView selectNewCarrierForEPA(@RequestParam(required = false) Long CarrierForEP3,@RequestParam Long epId){
        Reference car = objectService.getReference(3L,epId);
        if (car !=null) objectService.deleteReference(car);
        if(CarrierForEP3!=null){
            if (car == null) {
                car = new Reference();
                car.setAttrId(3L);
                car.setObjectId(epId);
            }
            car.setReferenceId(CarrierForEP3);
            objectService.addReference(car);
        }
        Reference res = objectService.getReference(4L, epId);
        if (res !=null) objectService.deleteReference(res);
        return new ModelAndView("redirect:http://localhost:3000/"+epId);
    }
    @PostMapping("/selectNewCarrierForEPZ")
    public ModelAndView selectNewCarrierForEPZ(@RequestParam(required = false) Long CarrierForEP4,@RequestParam Long epId){
        Reference car = objectService.getReference(3L,epId);
        if (car !=null) objectService.deleteReference(car);
        if(CarrierForEP4!=null){
            if (car == null) {
                car = new Reference();
                car.setAttrId(3L);
                car.setObjectId(epId);
            }
            car.setReferenceId(CarrierForEP4);
            objectService.addReference(car);
        }
        Reference res = objectService.getReference(4L, epId);
        if (res !=null) objectService.deleteReference(res);
        return new ModelAndView("redirect:http://localhost:3000/"+epId);
    }
    @PostMapping("/selectNewResourceForEPA")
    public ModelAndView selectNewResourceForEPA(@RequestParam(required = false) Long ResourceForEP3,@RequestParam Long epId){
        Reference res = objectService.getReference(4L,epId);
        if (res!= null){
            if (ResourceForEP3!=null){
                objectService.deleteReference(res);
                res.setReferenceId(ResourceForEP3);
                objectService.addReference(res);
            } else {
                objectService.deleteReference(res);
            }
        } else {
            res = new Reference();
            res.setObjectId(epId);
            res.setAttrId(4L);
            res.setReferenceId(ResourceForEP3);
            objectService.addReference(res);
        }
        return new ModelAndView("redirect:http://localhost:3000/"+epId);
    }
    @PostMapping("/selectNewResourceForEPZ")
    public ModelAndView selectNewResourceForEPZ(@RequestParam(required = false) Long ResourceForEP4,@RequestParam Long epId){
        Reference res = objectService.getReference(4L,epId);
        if (res!= null){
            if (ResourceForEP4!=null){
                objectService.deleteReference(res);
                res.setReferenceId(ResourceForEP4);
                objectService.addReference(res);
            } else {
                objectService.deleteReference(res);
            }
        } else {
            res = new Reference();
            res.setObjectId(epId);
            res.setAttrId(4L);
            res.setReferenceId(ResourceForEP4);
            objectService.addReference(res);
        }
        return new ModelAndView("redirect:http://localhost:3000/"+epId);
    }
    @GetMapping("/getAvailableResourcesForEPA")
    public List<ObjectEL> getAvailableResourcesForEPA(@RequestParam Long carrierId){
        return objectService.getAvailableResourcesForCarrierOfEthernetLink(carrierId);
    }
    @GetMapping("/getAvailableResourcesForEPZ")
    public List<ObjectEL> getAvailableResourcesForEPZ(@RequestParam Long carrierId){
        return objectService.getAvailableResourcesForCarrier(carrierId);
    }
}
