#!/bin/bash

echo "=========================================="
echo "SPRINT 1 - TEST EXECUTION REPORT"
echo "=========================================="
echo ""

# 1. Compilar backend
echo "[1/5] Compilando backend TypeScript..."
cd jaxon-core-api
pnpm build 2>&1
if [ $? -eq 0 ]; then
  echo "✅ Backend compiló exitosamente"
else
  echo "❌ Error compilando backend"
  exit 1
fi
cd ..

echo ""
echo "[2/5] Ejecutando pruebas unitarias backend (con cobertura)..."
cd jaxon-core-api
pnpm test:coverage 2>&1 | tee test-coverage.log
BACKEND_TEST_RESULT=$?
cd ..

echo ""
echo "[3/5] Ejecutando pruebas frontend..."
cd jaxon-client
pnpm test:coverage 2>&1 | tee test-frontend.log
FRONTEND_TEST_RESULT=$?
cd ..

echo ""
echo "[4/5] Validando estándares de código..."
node check-standards.js 2>&1
STANDARDS_RESULT=$?

echo ""
echo "=========================================="
echo "RESULTAT FINAL"
echo "=========================================="
echo "Backend Build: $([ $? -eq 0 ] && echo '✅ PASS' || echo '❌ FAIL')"
echo "Backend Tests: $([ $BACKEND_TEST_RESULT -eq 0 ] && echo '✅ PASS' || echo '❌ FAIL')"
echo "Frontend Tests: $([ $FRONTEND_TEST_RESULT -eq 0 ] && echo '✅ PASS' || echo '❌ FAIL')"
echo "Code Standards: $([ $STANDARDS_RESULT -eq 0 ] && echo '✅ PASS' || echo '❌ FAIL')"
echo "=========================================="
