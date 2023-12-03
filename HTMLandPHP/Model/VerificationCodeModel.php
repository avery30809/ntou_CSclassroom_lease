<?php
class VerificationCodeModel {
    public function generateCode() {
        $code = rand(100000, 999999);
        return $code;
    }
}