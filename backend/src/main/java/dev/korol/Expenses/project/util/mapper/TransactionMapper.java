package dev.korol.Expenses.project.util.mapper;

import dev.korol.Expenses.project.dto.transactionDTO.TransactionRequest;
import dev.korol.Expenses.project.dto.transactionDTO.TransactionResponse;
import dev.korol.Expenses.project.entity.Transaction;
import org.mapstruct.*;
import org.springframework.stereotype.Component;

/**
 * @author Korol Artur
 * 29.09.2025
 */

@Mapper(componentModel = "spring", nullValueMapMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT)
@Component
public interface TransactionMapper {

    @Mapping(source = "category.name", target = "categoryName")
    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "category.kind", target = "categoryKind")
    TransactionResponse toTransactionResponse(Transaction transaction);
    Transaction toTransaction(TransactionRequest transactionRequest);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateTransactionFromTransactionRequest(TransactionRequest transactionRequest, @MappingTarget Transaction transaction);

}
