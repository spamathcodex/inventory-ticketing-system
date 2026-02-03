<?php

use App\Http\Controllers\Api\ItemController;
use App\Http\Controllers\Api\TicketController;
use Illuminate\Support\Facades\Route;

Route::get('/items', [ItemController::class, 'index']);
Route::post('/items', [ItemController::class, 'store']);

Route::apiResource('items', ItemController::class);
Route::apiResource('tickets', TicketController::class);
