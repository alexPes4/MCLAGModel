package com.diploma.LAGmodel.service.Impl;

import com.diploma.LAGmodel.dto.PathElement;
import com.diploma.LAGmodel.model.ObjectEL;
import com.diploma.LAGmodel.model.Reference;
import com.diploma.LAGmodel.model.Value;
import com.diploma.LAGmodel.repository.ObjectRepository;
import com.diploma.LAGmodel.repository.ReferencesRepository;
import com.diploma.LAGmodel.repository.ValuesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import src.main.java.com.diploma.LAGmodel.service.ObjectService;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ObjectServiceImpl implements ObjectService {
    @Autowired
    private ObjectRepository objectRepository;
    @Autowired
    private ReferencesRepository referencesRepository;
    @Autowired
    private ValuesRepository valuesRepository;
    public List<ObjectEL> getAllObjects() {
        return objectRepository.findAll();
    }

    @Override
    public ObjectEL getObjectById(Long objectId) {
        return objectRepository.getById(objectId);
    }

    @Override
    public List<ObjectEL> getLAGModels() {
        return objectRepository.getObjectELSByTypeId(2L);
    }

    @Override
    public List<ObjectEL> getDevices() {
        return objectRepository.getObjectELSByTypeId(12L);
    }

    @Override
    public List<Object[]> getHierarchyForObject(Long objectId) {
        List<Object[]> objects =objectRepository.findUserByStatusAndName(objectId);
        return objects;
    }

    @Override
    public List<ObjectEL> getPortsByDevice(Long objectId) {
        return objectRepository.getObjectELSByParentId(objectId);
    }

    @Override
    public ObjectEL createPort(ObjectEL objectEL) {
        return objectRepository.save(objectEL);
    }

    @Override
    public ObjectEL createLAG(ObjectEL objectEL) {
        return objectRepository.save(objectEL);
    }

    @Override
    public void deletePort(Long portId) {
        objectRepository.deleteById(portId);
    }
    @Override
    public List<ObjectEL> getCountries() {
        return objectRepository.getObjectELSByTypeIdAndParentId(13L,1L);
    }

    @Override
    public ObjectEL createCity(ObjectEL city) {
        return objectRepository.save(city);
    }

    @Override
    public ObjectEL createLocation(ObjectEL loc) {
        return  objectRepository.save(loc);
    }

    @Override
    public List<ObjectEL> getChildLocations(Long locId, Long typeId) {
        return objectRepository.getObjectELSByTypeIdAndParentId(typeId,locId);
    }

    @Override
    public List<ObjectEL> getDeviceForParent(Long parentId) {
        List<ObjectEL> devices = new ArrayList<>();
        devices.addAll(objectRepository.getObjectELSByTypeIdAndParentId(11L,parentId));
        devices.addAll(objectRepository.getObjectELSByTypeIdAndParentId(12L,parentId));
        return devices;
    }

    @Override
    public ObjectEL createNewDevice(ObjectEL device) {
        return objectRepository.save(device);
    }

    @Override
    public List<ObjectEL> getAllNEsForLoc(Long locId) {
        return objectRepository.getObjectELSByClassIdAndParentId(17L,locId);
    }

    @Override
    public void deleteNE(Long neId) {
        objectRepository.deleteById(neId);
    }

    @Override
    public List<ObjectEL> getDevicesToAssignToNE(Long locId) {
        return objectRepository.findDevicesToAssign(locId);
    }

    @Override
    public List<ObjectEL> getCardsToAssignOnVMServer(Long locId) {
        return objectRepository.findCardsToAssignOnVMServer(locId);
    }

    @Override
    public List<ObjectEL> getDevicesToAssignOnVMServer(Long locId) {
        return objectRepository.findDevicesToAssignOnVMServer(locId);
    }

    @Override
    public List<ObjectEL> getSharedDevicesToAssignOnVMServer(Long locId) {
        return objectRepository.findSharedDevicesToAssignOnVMServer(locId);
    }

    @Override
    public List<ObjectEL> getAssignDevicesOnNEVMServer(Long neId) {
        return objectRepository.getAssignDevicesOnNEVMServer(neId);
    }

    @Override
    public List<ObjectEL> getAssignCardsOnNEVMServer(Long neId) {
        return objectRepository.getAssignCardsOnNEVMServer(neId);
    }

    @Override
    public List<ObjectEL> getAssignSharedDevicesOnNEVMServer(Long neId) {
        return objectRepository.getAssignSharedDevicesOnNEVMServer(neId);
    }

    @Override
    public List<ObjectEL> getAssignDeviceOnNE(Long neId) {
        return objectRepository.getAssignDeviceOnNE(neId);
    }

    @Override
    public void assignDevicesToNE(Reference ref) {
        referencesRepository.save(ref);
    }

    @Override
    public void releaseDevicesFromNE(Reference ref) {
        referencesRepository.delete(ref);
    }

    @Override
    public List<ObjectEL> getPortsToVIAssign(Long neId) {
        return objectRepository.findPortsToVIAssign(neId);
    }

    @Override
    public void addReference(Reference ref) {
        referencesRepository.save(ref);
    }

    @Override
    public List<ObjectEL> getLAGsForNE(Long neId) {
        return objectRepository.getObjectELSByTypeIdAndParentId(7L, neId);
    }

    @Override
    public ObjectEL createNewVM(ObjectEL vm) {
        return objectRepository.save(vm);
    }

    @Override
    public List<ObjectEL> getVMsForNE(Long neId) {
        return objectRepository.getObjectELSByTypeIdAndParentId(10L,neId);
    }

    @Override
    public void deleteVMs(Long[] vmIds) {
        for (Long vmId: vmIds
             ) {
            objectRepository.deleteById(vmId);
        }
    }

    @Override
    public ObjectEL createMCLAGmodel(ObjectEL mcLag) {
        return objectRepository.save(mcLag);
    }

    @Override
    public Reference getReference(Long attrId, Long objectId) {
        return referencesRepository.getReferenceByAttrIdAndAndObjectId(attrId,objectId);
    }

    @Override
    public List<ObjectEL> getAvailableResourcesForCarrier(Long carrierId) {
        return objectRepository.getAvailableResourcesForCarrier(carrierId);
    }

    @Override
    public List<ObjectEL> getAvailableResourcesForCarrierOfEthernetLink(Long carrierId) {
        return objectRepository.getAvailableResourcesForCarrierOfEthernetLink(carrierId);
    }

    @Override
    public List<PathElement> getEndPointsForMCLAG(Long mclagId) {
        List<ObjectEL> endPoints = objectRepository.getObjectELSByTypeIdAndParentId(3L, mclagId);
        endPoints.addAll(objectRepository.getObjectELSByTypeIdAndParentId(4L,mclagId));
        List<PathElement> pathElements = new ArrayList<>();

        for (ObjectEL ep:endPoints
             ) {
            PathElement pe = new PathElement();
            pe.setObject(ep);
            Reference carrierRef = referencesRepository.getReferenceByAttrIdAndAndObjectId(3L,ep.getObjectId());
            if (carrierRef!=null){
                pe.setCarrier(objectRepository.getById(carrierRef.getReferenceId()));
            }
            Reference resourceRef = referencesRepository.getReferenceByAttrIdAndAndObjectId(4L,ep.getObjectId());
            if (resourceRef!=null){
                pe.setResource(objectRepository.getById(resourceRef.getReferenceId()));
            }
            pathElements.add(pe);
        }
        return pathElements;
    }

    @Override
    public List<PathElement> getPathElementsForMCLAG(Long mclagId) {
        List<ObjectEL> objects= objectRepository.getObjectELSByTypeIdAndParentId(5L,mclagId);
        List<PathElement> pathElements= new ArrayList<>();
        for (ObjectEL ep:objects
        ) {
            PathElement pe = new PathElement();
            pe.setObject(ep);
            Reference carrierRef = referencesRepository.getReferenceByAttrIdAndAndObjectId(3L,ep.getObjectId());
            if (carrierRef!=null){
                pe.setCarrier(objectRepository.getById(carrierRef.getReferenceId()));
            }
            Reference resourceRef = referencesRepository.getReferenceByAttrIdAndAndObjectId(4L,ep.getObjectId());
            if (resourceRef!=null){
                pe.setResource(objectRepository.getById(resourceRef.getReferenceId()));
            }

            pathElements.add(pe);
        }
        return pathElements;
    }

    @Override
    public ObjectEL createPathElement(ObjectEL pe) {
        return objectRepository.save(pe);
    }

    @Override
    @Transactional
    public void deletePathElements(List<Long> peIds) {
        for (Long id: peIds
             ) {
            referencesRepository.deleteAllByObjectId(id);
            objectRepository.deleteById(id);
        }
    }

    @Override
    public List<ObjectEL> getAssignedPortsForLAG(Long lagId) {


        return objectRepository.getAssignedPortsForLAG(lagId);
    }

    @Override
    public ObjectEL getLocationForMCLAGModel(Long mclagID, Long typeEP) {
        return objectRepository.getLocationForMCLAGModel(mclagID, (typeEP==3L)?10L:11L);
    }

    @Override
    public void releasePortsFromLAG(Reference ref) {
        referencesRepository.delete(ref);
    }

    @Override
    public void deleteReference(Reference ref) {
        if (ref!=null) referencesRepository.delete(ref);
    }

    @Override
    public List<ObjectEL> getAllEthernetLinks() {
        return objectRepository.getObjectELSByTypeId(6L);
    }

    @Override
    public List<ObjectEL> getObjectByParentIdAndTypeId(Long parentId, Long typeId) {
        return objectRepository.getObjectELSByTypeIdAndParentId(typeId,parentId);
    }

    @Override
    public List<ObjectEL> getAvailableEthernetLinksForModel(Long[] locIds) {
        return objectRepository.getAvailableEthernetLinksForModel(locIds[0],locIds[1]);
    }

    @Override
    public Long getMaxOrderForOrderELByParentAndType(Long parentId, Long typeId) {
        return objectRepository.getMaxOrderForOrderELByParentAndType(parentId,typeId);
    }

    @Override
    public ObjectEL createVirtPM(ObjectEL vpm) {
        return  objectRepository.save(vpm);
    }

    @Override
    public ObjectEL getParentByObjectId(Long objectId) {
        return objectRepository.getParentByObjectId(objectId);
    }

    @Override
    @Transactional
    public void deleteVPMs(Long[] vpmIds) {
        for (Long vpmId : vpmIds
             ) {
            referencesRepository.deleteAllByObjectId(vpmId);
            objectRepository.deleteById(vpmId);
        }
    }

    @Override
    @Transactional
    public void deleteAllReferencesByObjectId(Long objectId) {
        referencesRepository.deleteAllByObjectId(objectId);
    }

    @Override
    @Transactional
    public void deleteObjectELByObjectId(Long objectId) {
        objectRepository.deleteById(objectId);
    }

    @Override
    @Transactional
    public void deleteLAGs(Long[] virtIntIds) {
        for (Long virIntId : virtIntIds
        ) {
            referencesRepository.deleteAllByObjectId(virIntId);
            objectRepository.deleteById(virIntId);
        }
    }

    @Override
    @Transactional
    public void deleteNEs(Long[] neIds) {
        for (Long neId : neIds
        ) {
            referencesRepository.deleteAllByObjectId(neId);
            objectRepository.deleteById(neId);
        }
    }

    @Override
    public ObjectEL getLocationForObject(Long objectId) {
        return objectRepository.getLocationForObject(objectId);
    }

    @Override
    public ObjectEL getLAGForPort(Long objectId) {
        return objectRepository.getLAGForPort(objectId);
    }

    @Override
    public List<ObjectEL> getVPMsForPort(Long objectId) {
        return objectRepository.getVPMsForPort(objectId);
    }

    @Override
    public ObjectEL getCircuitForPort(Long objectId) {
        return objectRepository.getCircuitForPort(objectId);
    }

    @Override
    public Value addValueForObject(Long attrId, Long objectId, String value) {
        Value val = new Value();
        val.setAttrId(attrId);
        val.setObjectId(objectId);
        val.setValue(value);
        return valuesRepository.save(val);
    }

    @Override
    public Value getValueByAttrIdAndObjectId(Long attrId, Long objectId) {
        return valuesRepository.getValueByAttrIdAndAndObjectId(attrId, objectId);
    }

    @Override
    public Value saveValue(Value value) {
        return valuesRepository.save(value);
    }

    @Override
    public void deleteValue(Value value) {
        valuesRepository.delete(value);
    }

    @Override
    @Transactional
    public void deleteAllValuesByObjectId(Long objectId) {
        valuesRepository.deleteAllByObjectId(objectId);
    }


}
