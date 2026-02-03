<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Item::create([
            'category_id' => 1, // Pastikan kategori ID 1 ada (Elektronik)
            'name' => 'MacBook Pro M3',
            'sku' => 'LAP-001',
            'stock' => 10,
            'status' => 'available'
        ]);
    }
}
