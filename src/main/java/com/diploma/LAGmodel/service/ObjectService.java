package src.main.java.com.diploma.LAGmodel.service;

import com.diploma.LAGmodel.dto.PathElement;
import com.diploma.LAGmodel.model.ObjectEL;
import com.diploma.LAGmodel.model.Reference;
import com.diploma.LAGmodel.model.Value;

import java.math.BigInteger;
import java.util.List;
import java.util.Map;

public interface ObjectService {
    public List<ObjectEL> getAllObjects();
    public ObjectEL getObjectById(Long objectId);
    public List<ObjectEL> getLAGModels();
    public List<ObjectEL> getDevices();

    public List<Object[]> getHierarchyForObject(Long objectId);
    public List<ObjectEL> getPortsByDevice(Long objectId);

    public ObjectEL createPort(ObjectEL objectEL);
    public ObjectEL createLAG(ObjectEL objectEL);
    public void deletePort(Long portId);
    public List<ObjectEL> getCountries();
    public ObjectEL createCity(ObjectEL city);
    public ObjectEL createLocation(ObjectEL loc);;
    public List<ObjectEL> getChildLocations(Long locId, Long typeId);
    public List<ObjectEL> getDeviceForParent(Long parentId);
    public ObjectEL createNewDevice(ObjectEL device);

    public List<ObjectEL> getAllNEsForLoc(Long locId);
    public void deleteNE(Long neId);
    public List<ObjectEL> getDevicesToAssignToNE(Long locId);
    public List<ObjectEL> getCardsToAssignOnVMServer(Long locId);
    public List<ObjectEL> getDevicesToAssignOnVMServer(Long locId);
    public List<ObjectEL> getSharedDevicesToAssignOnVMServer(Long locId);
    public List<ObjectEL> getAssignDevicesOnNEVMServer(Long neId);
    public List<ObjectEL> getAssignCardsOnNEVMServer(Long neId);
    public List<ObjectEL> getAssignSharedDevicesOnNEVMServer(Long neId);
    public List<ObjectEL> getAssignDeviceOnNE(Long neId);
    public void assignDevicesToNE(Reference ref);
    public void releaseDevicesFromNE(Reference ref);
    public List<ObjectEL> getPortsToVIAssign(Long neId);
    public void addReference(Reference ref);
    public List<ObjectEL>  getLAGsForNE(Long neId);
    public ObjectEL createNewVM(ObjectEL vm);
    public List<ObjectEL> getVMsForNE(Long neId);
    public void deleteVMs(Long[] vmIds);
    public ObjectEL createMCLAGmodel(ObjectEL mcLag);
    public Reference getReference(Long attrId, Long objectId);
    public List<ObjectEL> getAvailableResourcesForCarrier(Long carrierId);
    public List<ObjectEL> getAvailableResourcesForCarrierOfEthernetLink(Long carrierId);
    public List<PathElement> getEndPointsForMCLAG(Long mclagId);
    public List<PathElement> getPathElementsForMCLAG(Long mclagId);
    public ObjectEL createPathElement(ObjectEL pe);
    public void deletePathElements(List<Long> peIds);
    public List<ObjectEL> getAssignedPortsForLAG(Long lagId);
    ObjectEL getLocationForMCLAGModel(Long mclagID, Long typeEP);
    public void releasePortsFromLAG(Reference ref);
    public void deleteReference(Reference ref);
    public List<ObjectEL> getAllEthernetLinks();
    public List<ObjectEL> getObjectByParentIdAndTypeId(Long parentId, Long typeId);
    public List<ObjectEL> getAvailableEthernetLinksForModel(Long[] locIds);
    public Long getMaxOrderForOrderELByParentAndType(Long parentId, Long typeId);
    public ObjectEL createVirtPM(ObjectEL vpm);
    public ObjectEL getParentByObjectId(Long objectId);
    public void deleteVPMs(Long[] vmIds);
    public void deleteAllReferencesByObjectId(Long objectId);
    public void deleteObjectELByObjectId(Long objectId);
    public void deleteLAGs(Long[] virtIntIds);
    public void deleteNEs(Long[] neIds);
    public ObjectEL getLocationForObject(Long objectId);
    public ObjectEL getLAGForPort(Long objectId);
    public List<ObjectEL> getVPMsForPort(Long objectId);
    public ObjectEL getCircuitForPort(Long objectId);
    public Value addValueForObject(Long attrId, Long objectId, String value);
    public Value getValueByAttrIdAndObjectId(Long attrId, Long objectId);
    public Value saveValue(Value value);
    public void deleteValue(Value value);
    public void deleteAllValuesByObjectId(Long objectId);
}
