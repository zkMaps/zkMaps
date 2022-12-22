import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async ({
  deployments: { deploy },
  getNamedAccounts,
}) => {
  const { deployer } = await getNamedAccounts();
  await deploy("VerifierRayTracing4Private", {
    from: deployer,
    log: true,
    waitConfirmations: 2,
  });
};

func.tags = ["VerifierRayTracing4Private"];

export default func;
