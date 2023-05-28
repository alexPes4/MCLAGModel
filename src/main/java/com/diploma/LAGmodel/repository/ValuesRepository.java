package com.diploma.LAGmodel.repository;

import com.diploma.LAGmodel.model.Reference;
import com.diploma.LAGmodel.model.Value;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ValuesRepository extends JpaRepository<Value, Long> {
    Value getValueByAttrIdAndAndObjectId(Long attrId, Long objectId);
    void deleteAllByObjectId(Long objectId);
}
