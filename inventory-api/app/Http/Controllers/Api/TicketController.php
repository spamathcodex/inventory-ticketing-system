<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function index()
    {
        return response()->json(Ticket::with(['item', 'user'])->latest()->get());
    }

    public function store(Request $request)
    {
        $ticket = Ticket::create([
            'user_id' => 1, // Kita hardcode dulu ke Admin
            'item_id' => $request->item_id,
            'issue_description' => $request->issue,
            'priority' => $request->priority,
            'status' => 'open'
        ]);
        return response()->json($ticket);
    }
}
