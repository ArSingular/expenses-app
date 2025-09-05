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
public class ExpenseController {

    private final ExpenseService expenseService;
    private final UserService userService;

    @PostMapping()
    public ResponseEntity<ExpenseResponse> createExpense(@Valid @RequestBody ExpenseRequest expenseRequest){
        ExpenseResponse expenseResponse = expenseService.createExpense(expenseRequest);

        return ResponseEntity.status(HttpStatus.CREATED).body(expenseResponse);
    }

    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> getExpenses(@AuthenticationPrincipal UserDetails userDetails){
        String email = userDetails.getUsername();

        UserResponse userResponse = userService.getUserByEmail(email);
        List<ExpenseResponse> expenseResponses = expenseService.getExpensesByUser(userResponse.getId());

        return ResponseEntity.ok(expenseResponses);
    }

    @GetMapping("/{expenseId}")
    public ResponseEntity<ExpenseResponse> getExpense(@PathVariable Long expenseId){
        return  ResponseEntity.ok(expenseService.getExpenseById(expenseId));
    }

    @PutMapping("/{expenseId}")
    public ResponseEntity<ExpenseResponse> updateExpense(@PathVariable Long expenseId,@Valid @RequestBody ExpenseRequest expenseRequest){

        ExpenseResponse expenseResponse = expenseService.updateExpense(expenseId, expenseRequest);

        return ResponseEntity.ok(expenseResponse);
    }

    @DeleteMapping("/{expenseId}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long expenseId){
        expenseService.deleteExpense(expenseId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/total")
    public ResponseEntity<BigDecimal> getTotalExpensesAmount(@RequestParam Long userId){
        return ResponseEntity.ok(expenseService.getTotalByUser(userId));
    }

}
