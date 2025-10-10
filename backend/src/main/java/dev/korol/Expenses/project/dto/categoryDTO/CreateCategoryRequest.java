package dev.korol.Expenses.project.dto.categoryDTO;

import dev.korol.Expenses.project.entity.Kind;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * @author Korol Artur
 * 09.10.2025
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateCategoryRequest {

    private String name;
    private Kind kind;
    private long parentId;

}
