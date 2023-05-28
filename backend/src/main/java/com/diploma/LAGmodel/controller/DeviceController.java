package com.diploma.LAGmodel.controller;

import com.diploma.LAGmodel.model.ObjectEL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/objects/devices")
public class DeviceController {
    @Autowired
    private src.main.java.com.diploma.LAGmodel.service.ObjectService objectService;

    @GetMapping("/getDeviceForParent")
    public List<ObjectEL> getAllObjects(@RequestParam Long parentId){
        return objectService.getDeviceForParent(parentId);
    }

    @PostMapping("/createNewDevice")
    public ModelAndView createDevice(@RequestParam String name,
                                     @RequestParam String description,
                                     @RequestParam Long parentId){
        ObjectEL device =new ObjectEL();
        device.setOrder(objectService.getMaxOrderForOrderELByParentAndType(parentId,12L)+1);
        ObjectEL location = objectService.getObjectById(parentId);
        device.setName(location.getName()+" "+name+" "+device.getOrder());
        device.setDescription(description);
        device.setTypeId(12L);
        device.setParentId(parentId);
        device = objectService.createPort(device);
        return new ModelAndView("redirect:http://localhost:3000/"+device.getObjectId());

    }
    @PostMapping("/createNewCard")
    public ModelAndView createCard(@RequestParam String name,
                                     @RequestParam String description,
                                     @RequestParam Long parentId){
        ObjectEL card =new ObjectEL();
        card.setOrder(objectService.getMaxOrderForOrderELByParentAndType(parentId,11L)+1);
        card.setName(name+" "+card.getOrder());
        card.setDescription(description);
        card.setTypeId(11L);
        card.setParentId(parentId);
        card = objectService.createPort(card);
        return new ModelAndView("redirect:http://localhost:3000/"+card.getObjectId());

    }
    @GetMapping("/deleteDevices")
    public String deleteDevices(@RequestParam Long[] devIds,@RequestParam Long parentId){
        for (Long devId: devIds) {
            objectService.deletePort(devId);
        }
        return "http://localhost:3000/"+parentId;
    }


}
