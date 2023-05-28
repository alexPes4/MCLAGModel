package com.diploma.LAGmodel.repository;

import com.diploma.LAGmodel.model.ObjectEL;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigInteger;
import java.util.Collection;
import java.util.List;

@Repository
public interface ObjectRepository extends JpaRepository <ObjectEL, Long> {
    public List<ObjectEL> getObjectELSByTypeId(Long typeId);

    @Query(value = "with recursive cte as (\n" +
           "    select object_id, name, parent_id, 1 as level\n" +
           "    from objects\n" +
           "    where object_id = ?1\n" +
           "    union all\n" +
           "    select c.object_id, c.name, c.parent_id, ct.level + 1\n" +
           "    from cte ct\n" +
           "             join objects c on c.object_id = ct.parent_id\n" +
           ")\n" +
           "select object_id, name, level\n" +
           "from cte order by level desc", nativeQuery = true)
    public List<Object[]> findUserByStatusAndName(Long objectId);

    public List<ObjectEL> getObjectELSByParentId(Long objectId);

    public List<ObjectEL> getObjectELSByTypeIdAndParentId(Long typeId, Long parentId);
    public List<ObjectEL> getObjectELSByClassIdAndParentId(Long classId, Long parentId);

    @Query(value = "select dev.* from objects dev, objects loc\n" +
                   "where loc.object_id= ?1\n" +
                   "      and dev.parent_id=loc.object_id\n" +
                   "      and dev.type_id in (11,12)\n" +
                   "      and not exists(select * from reference r where r.attr_id=8 and r.reference_id=dev.object_id)", nativeQuery = true)
    public List<ObjectEL> findDevicesToAssign(Long locId);

    @Query(value = "select dev.* from objects dev, objects loc\n" +
                   "where loc.object_id= ?1\n" +
                   "      and dev.parent_id=loc.object_id\n" +
                   "      and dev.type_id in (11)\n" +
                   "      and exists(select * from reference r " +
                   "            where r.attr_id=8 and r.reference_id=dev.object_id)" +
                   "      and not exists(select r.* from reference r, objects o " +
                   "            where r.attr_id=8 and r.reference_id=dev.object_id" +
                   "            and o.object_id=r.object_id and o.type_id=9)",
           nativeQuery = true)
    public List<ObjectEL> findCardsToAssignOnVMServer(Long locId);

    @Query(value = "select dev.* from objects dev, objects loc\n" +
                   "where loc.object_id= ?1\n" +
                   "      and dev.parent_id=loc.object_id\n" +
                   "      and dev.type_id in (12)\n" +
                   "      and not exists(select * from reference r where r.attr_id=8 and r.reference_id=dev.object_id)",
           nativeQuery = true)
    public List<ObjectEL> findDevicesToAssignOnVMServer(Long locId);

    @Query(value = "select dev.* from objects dev, objects loc\n" +
                   "where loc.object_id= ?1\n" +
                   "  and dev.parent_id=loc.object_id\n" +
                   "  and dev.type_id in (12)\n" +
                   "  and exists(select * from reference r\n" +
                   "  where r.attr_id=8 and r.reference_id=dev.object_id)\n" +
                   "  and not exists(select * from reference r, objects o\n" +
                   "    where r.attr_id=8 and r.reference_id=dev.object_id\n" +
                   "      and o.object_id=r.object_id and o.type_id=9)",
           nativeQuery = true)
    public List<ObjectEL> findSharedDevicesToAssignOnVMServer(Long locId);

    @Query(value = "select o.* from objects o, reference r\n" +
                   "where r.attr_id=8 and r.object_id=? and o.object_id=r.reference_id", nativeQuery = true)
    public List<ObjectEL> getAssignDeviceOnNE(Long neId);

    @Query(value = "select o.* from objects o, reference r\n" +
                   "where r.attr_id=8 and r.object_id=?1\n" +
                   "  and o.object_id=r.reference_id and o.type_id=12\n" +
                   "and (select count(*) from reference c where c.attr_id=8 and c.reference_id=r.reference_id)<2", nativeQuery = true)
    public List<ObjectEL> getAssignDevicesOnNEVMServer(Long neId);

    @Query(value = "select o.* from objects o, reference r\n" +
                   "where r.attr_id=8 and r.object_id=?1\n" +
                   "  and o.object_id=r.reference_id and o.type_id=11", nativeQuery = true)
    public List<ObjectEL> getAssignCardsOnNEVMServer(Long neId);

    @Query(value = "select o.* from objects o, reference r\n" +
                   "where r.attr_id=8 and r.object_id=?1\n" +
                   "  and o.object_id=r.reference_id\n" +
                   "and (select count(*) from reference c where c.attr_id=8 and c.reference_id=r.reference_id)>1", nativeQuery = true)
    public List<ObjectEL> getAssignSharedDevicesOnNEVMServer(Long neId);

    @Query(value = "select port.* from reference refDev, objects port\n" +
                   "where refDev.attr_id=8\n" +
                   "and refDev.object_id= ?1\n" +
                   "and port.parent_id=refDev.reference_id\n" +
                   "and not exists(select * from reference r where r.attr_id=9 and r.reference_id=port.object_id)", nativeQuery = true)
    public List<ObjectEL> findPortsToVIAssign(Long neId);

    @Query(value = "select lag.* from objects lag\n" +
                   "where lag.parent_id= ?1 and lag.type_id=7\n" +
                   "and not exists ( select * from reference r \n" +
                   "where r.attr_id=4 and r.reference_id=lag.object_id)", nativeQuery = true)
    public List<ObjectEL> getAvailableResourcesForCarrier(Long neId);

    @Query(value = "select p.* from reference r, objects p\n" +
                   "where r.attr_id = 8 and r.object_id = ?\n" +
                   "  and p.parent_id = r.reference_id and p.type_id = 8\n" +
                   "and not exists(select * from reference l where l.attr_id=4 and l.reference_id=p.object_id)", nativeQuery = true)
    public List<ObjectEL> getAvailableResourcesForCarrierOfEthernetLink(Long neId);

    @Query(value = "SELECT o.* FROM reference r, objects o \n" +
                   "where r.object_id = ? and r.attr_id=9\n" +
                   "and o.object_id=r.reference_id", nativeQuery = true)
    public List<ObjectEL> getAssignedPortsForLAG(Long lagId);
    @Query(value = "select o.* from reference r, objects o\n" +
                   "where r.object_id = ?1 and r.attr_id = ?2\n" +
                   "and o.object_id = r.reference_id", nativeQuery = true)
    public ObjectEL getLocationForMCLAGModel(Long mclagId, Long attrId);

    @Query(value = "select o.* from reference rA, reference rZ, objects o\n" +
                   "where rA.attr_id =10 and rA.reference_id in (?1,?2)\n" +
                   "and rZ.attr_id = 11 and rZ.reference_id in (?1,?2)\n" +
                   "and rA.object_id = rZ.object_id\n" +
                   "and o.object_id = rA.object_id and o.type_id=6", nativeQuery = true)
    public List<ObjectEL> getAvailableEthernetLinksForModel(Long locId1, Long locId2);

    @Query(value = "select coalesce(max(o.order_number),0) from objects o, reference r \n" +
                   "where o.parent_id = ?1 and o.type_id = ?2", nativeQuery = true)
    public Long getMaxOrderForOrderELByParentAndType(Long parentId, Long typeId);

    @Query(value = "select p.* from objects o, objects p where o.object_id=? " +
                   "and p.object_id = o.parent_id", nativeQuery = true)
    public ObjectEL getParentByObjectId(Long objectId);
    @Query(value = "with recursive cte as (\n" +
                   "    select object_id, name, parent_id, 1 as level\n" +
                   "    from objects\n" +
                   "    where object_id = ?1\n" +
                   "    union all\n" +
                   "    select c.object_id, c.name, c.parent_id, ct.level + 1\n" +
                   "    from cte ct\n" +
                   "             join objects c on c.object_id = ct.parent_id\n" +
                   ")\n" +
                   "select o.*\n" +
                   "from cte, objects o where o.object_id=cte.object_id and o.type_id=15 order by level desc", nativeQuery = true)
    public ObjectEL getLocationForObject(Long objectId);

    @Query(value = "select o.* from reference r, objects o\n" +
                   "where r.attr_id =9 and r.reference_id=?1\n" +
                   "and o.object_id = r.object_id\n" +
                   "and o.type_id=7", nativeQuery = true)
    public ObjectEL getLAGForPort(Long objectId);
    @Query(value = "select o.* from reference r, objects o\n" +
                   "where r.attr_id in (14, 15) and r.reference_id=?1\n" +
                   "and o.object_id = r.object_id\n" +
                   "and o.type_id=23", nativeQuery = true)
    public List<ObjectEL> getVPMsForPort(Long objectId);


    @Query(value = "select circuit.* from reference r, objects pe, objects circuit\n" +
                   "where r.attr_id in (4) and r.reference_id=?1\n" +
                   "and pe.object_id = r.object_id\n" +
                   "and pe.type_id in (3,4,5)\n" +
                   "and circuit.object_id = pe.parent_id", nativeQuery = true)
    public ObjectEL getCircuitForPort(Long objectId);
}
