<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Item;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function index()
    {
        // Mengambil semua barang beserta nama kategorinya
        $items = Item::with('category')->get();
        return response()->json([
            'success' => true,
            'data' => $items
        ]);
    }

    public function store(Request $request)
    {
        $item = Item::create($request->all());
        return response()->json(['message' => 'Barang berhasil ditambah', 'data' => $item], 201);
    }

    public function show(Item $item)
    {
        return response()->json($item->load('category'));
    }

    // Hapus Barang
    public function destroy(Item $item)
    {
        $item->delete();
        return response()->json(['message' => 'Barang berhasil dihapus']);
    }
}
