package dev.korol.Expenses.project.controller;

import dev.korol.Expenses.project.dto.transactionDTO.TransactionRequest;
import dev.korol.Expenses.project.dto.transactionDTO.TransactionResponse;
import dev.korol.Expenses.project.dto.userDTO.UserResponse;
import dev.korol.Expenses.project.service.TransactionService;
import dev.korol.Expenses.project.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author Korol Artur
 * 29.09.2025
 */

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@Validated
@CrossOrigin(origins = "http://localhost:4200")
public class TransactionController {

    private final TransactionService transactionService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getTransactions(@AuthenticationPrincipal UserDetails userDetails){
        String email = userDetails.getUsername();
        UserResponse user = userService.getUserByEmail(email);

        List<TransactionResponse> transactionResponses = transactionService.findAllByUserId(user.getUserId());

        return ResponseEntity.ok(transactionResponses);
    }

    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(@AuthenticationPrincipal UserDetails userDetails,
                                                                 @Valid @RequestBody TransactionRequest transactionRequest){

        String email = userDetails.getUsername();
        UserResponse user = userService.getUserByEmail(email);

        TransactionResponse created =  transactionService.createTransaction(user.getUserId(), transactionRequest);

        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{transactionId}")
    public ResponseEntity<TransactionResponse> updateTransaction(@AuthenticationPrincipal UserDetails userDetails,
                                                                 @Valid @RequestBody TransactionRequest transactionRequest, @PathVariable long transactionId){

        String email = userDetails.getUsername();
        UserResponse user = userService.getUserByEmail(email);

        TransactionResponse updated = transactionService.updateTransaction(transactionId, user.getUserId(), transactionRequest);

        return ResponseEntity.ok(updated);

    }

    @DeleteMapping("/{transactionId}")
    public ResponseEntity<Void> deleteTransaction(@AuthenticationPrincipal UserDetails userDetails, @PathVariable long transactionId){
        String email = userDetails.getUsername();
        UserResponse user = userService.getUserByEmail(email);

        transactionService.deleteTransaction(transactionId, user.getUserId());

        return ResponseEntity.noContent().build();
    }

}
