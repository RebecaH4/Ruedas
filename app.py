from flask import Flask, request, jsonify
from flask_cors import CORS
import itertools

app = Flask(__name__)
CORS(app)

@app.route('/ruedas', methods=['POST'])
def ruedas_asignacion():
    data = request.get_json(silent=True) or {}
    precios = data.get('precios')
    if not precios or len(precios) != 4 or any(len(row) != 4 for row in precios):
        return jsonify({'error': 'Debes enviar una matriz de precios 4x4.'}), 400

    empresas = [f'Empresa {i+1}' for i in range(4)]
    tipos = ['Tipo T', 'Tipo H', 'Tipo V', 'Tipo W']
    mejor_costo = float('inf')
    mejor_asignacion = None

    for perm in itertools.permutations(range(4)):
        costo = sum(precios[i][perm[i]] for i in range(4))
        if costo < mejor_costo:
            mejor_costo = costo
            mejor_asignacion = perm

    resultado = []
    for i, tipo_idx in enumerate(mejor_asignacion):
        resultado.append({
            'empresa': empresas[i],
            'tipo': tipos[tipo_idx],
            'precio': precios[i][tipo_idx]
        })

    heuristica = sum(min(row) for row in precios)

    return jsonify({
        'asignacion': resultado,
        'costo_total': mejor_costo,
        'heuristica_admisible': heuristica
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
