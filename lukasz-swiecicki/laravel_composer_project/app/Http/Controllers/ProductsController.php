<?php
namespace App\Http\Controllers;

use App\Models\Product; // Import modelu
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::all();
        return view('products.index', compact('products'));
    }

    public function create()
    {
        return view('products.create');
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|max:255',
            'description' => 'required',
            'price' => 'required|numeric',
            'image' => 'nullable|image'
        ]);

        Product::create($validatedData);

        return redirect()->route('products.index')->with('success', 'Produkt dodany!');
    }

    public function show(Product $product)
    {
        return view('products.show', compact('product'));
    }

    public function edit(Product $product)
    {
        return view('products.edit', compact('product'));
    }

    public function update(Request $request, Product $product)
    {
        $validatedData = $request->validate([
            'name' => 'required|max:255',
            'price' => 'required|numeric',
        ]);

        $product->update($validatedData);

        return redirect()->route('products.index')->with('success', 'Produkt zaktualizowany!');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->route('products.index')->with('success', 'Produkt usunięty!');
    }
}
?>