package dev.korol.Expenses.project.controller;

import dev.korol.Expenses.project.dto.expenseDTO.ExpenseRequest;
import dev.korol.Expenses.project.dto.expenseDTO.ExpenseResponse;
import dev.korol.Expenses.project.dto.userDTO.UserResponse;
import dev.korol.Expenses.project.service.ExpenseService;
import dev.korol.Expenses.project.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * @author Korol Artur
 * 30.08.2025
 */

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
@Validated
public class ExpenseController {

    private final ExpenseService expenseService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<ExpenseResponse> createExpense(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ExpenseRequest request
    ) {
        String email = userDetails.getUsername();
        UserResponse user = userService.getUserByEmail(email);

        ExpenseResponse created = expenseService.createExpense(user.getUserId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> getExpenses(@AuthenticationPrincipal UserDetails userDetails){
        String email = userDetails.getUsername();
        UserResponse userResponse = userService.getUserByEmail(email);

        List<ExpenseResponse> expenseResponses = expenseService.getExpensesByUser(userResponse.getUserId());

        return ResponseEntity.ok(expenseResponses);
    }

    @GetMapping("/{expenseId}")
    public ResponseEntity<ExpenseResponse> getExpense(@PathVariable Long expenseId){
        return  ResponseEntity.ok(expenseService.getExpenseById(expenseId));
    }

    @PutMapping("/{expenseId}")
    public ResponseEntity<ExpenseResponse> updateExpense(
            @PathVariable Long expenseId,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ExpenseRequest request
    ) {
        String email = userDetails.getUsername();
        UserResponse user = userService.getUserByEmail(email);

        ExpenseResponse updated = expenseService.updateExpense(expenseId, user.getUserId(), request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{expenseId}")
    public ResponseEntity<Void> deleteExpense(
            @PathVariable Long expenseId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String email = userDetails.getUsername();
        UserResponse user = userService.getUserByEmail(email);

        expenseService.deleteExpense(expenseId, user.getUserId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/total")
    public ResponseEntity<BigDecimal> getTotal(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String email = userDetails.getUsername();
        UserResponse user = userService.getUserByEmail(email);

        BigDecimal total = expenseService.getTotalByUser(user.getUserId());
        return ResponseEntity.ok(total);
    }

}
