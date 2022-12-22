import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async ({
  deployments: { deploy },
  getNamedAccounts,
}) => {
  const { deployer } = await getNamedAccounts();
  await deploy("VerifierRayTracing10Private", {
    from: deployer,
    log: true,
    waitConfirmations: 2,
  });
};

func.tags = ["VerifierRayTracing10Private"];

export default func;
