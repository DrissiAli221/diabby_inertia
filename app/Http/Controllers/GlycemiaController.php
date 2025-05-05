<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GlycemiaRecord;
use Inertia\Inertia;

class GlycemiaController extends Controller
{
    public function index()
    {
        $records = auth()->user()->glycemiaRecords()->latest()->get();
        return Inertia::render('Glycemia/Index', [
            'records' => $records,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'value' => 'required|numeric',
            'measured_at' => 'required|date',
            'status' => 'required|in:normal,high,low',
            'note' => 'nullable|string'
        ]);

        auth()->user()->glycemiaRecords()->create($validated);

        return redirect()->route('glycemia.index');
    }
}
